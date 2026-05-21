'use strict';

const fs = require('fs');
const path = require('path');

class GoalTracker {
  constructor() {
    this.baseDir = path.join('.', 'generated', 'metrics');
    this.filePath = path.join(this.baseDir, 'goals.json');
    this.state = this._load();
  }

  _load() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      } catch (_) {
        // fall through to default state
      }
    }

    const startDate = new Date().toISOString().slice(0, 10);
    const initial = {
      startDate,
      goals: {
        target3m: 50,
        target6m: 150,
      },
      actualExecutions: 0,
      runLogs: [],
      executionLogs: [],
      partnerReferrals: [],
      partnerExecutions: [],
      updatedAt: new Date().toISOString(),
    };
    this._save(initial);
    return initial;
  }

  _save(nextState) {
    nextState.updatedAt = new Date().toISOString();
    fs.writeFileSync(this.filePath, JSON.stringify(nextState, null, 2), 'utf8');
    this.state = nextState;
  }

  recordRun(run) {
    const next = { ...this.state };
    next.runLogs = next.runLogs || [];

    next.runLogs.push({
      timestamp: new Date().toISOString(),
      topicCategory: run.topicCategory || 'unknown',
      topic: run.topic || '',
      postedInstagram: !!run.postedInstagram,
      postedThreads: !!run.postedThreads,
      postedYoutube: !!run.postedYoutube,
      track2ActionPrepared: !!run.track2ActionPrepared,
      track3ActionPrepared: !!run.track3ActionPrepared,
    });

    if (next.runLogs.length > 500) {
      next.runLogs = next.runLogs.slice(-500);
    }

    this._save(next);
  }

  addExecutions(count, source = 'manual', note = '') {
    const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
    if (!safeCount) return this.getSummary();

    const next = { ...this.state };
    next.actualExecutions = (next.actualExecutions || 0) + safeCount;
    next.executionLogs = next.executionLogs || [];
    next.executionLogs.push({
      timestamp: new Date().toISOString(),
      count: safeCount,
      source,
      note,
    });

    this._save(next);
    return this.getSummary();
  }

  addPartnerReferral(partnerName, count = 1, source = 'manual', note = '') {
    const name = String(partnerName || '').trim();
    const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
    if (!name || !safeCount) return this.getPartnerWeeklyRanking();

    const next = { ...this.state };
    next.partnerReferrals = next.partnerReferrals || [];
    next.partnerReferrals.push({
      timestamp: new Date().toISOString(),
      partnerName: name,
      count: safeCount,
      source,
      note,
    });

    this._save(next);
    return this.getPartnerWeeklyRanking();
  }

  addPartnerExecution(partnerName, count = 1, source = 'manual', note = '') {
    const name = String(partnerName || '').trim();
    const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
    if (!name || !safeCount) return this.getPartnerPerformance();

    const next = { ...this.state };
    next.partnerExecutions = next.partnerExecutions || [];
    next.partnerExecutions.push({
      timestamp: new Date().toISOString(),
      partnerName: name,
      count: safeCount,
      source,
      note,
    });

    // 전체 실행건수도 동기화
    next.actualExecutions = (next.actualExecutions || 0) + safeCount;
    next.executionLogs = next.executionLogs || [];
    next.executionLogs.push({
      timestamp: new Date().toISOString(),
      count: safeCount,
      source: `${source}:partner`,
      note: note || name,
    });

    this._save(next);
    return this.getPartnerPerformance();
  }

  getPartnerWeeklyRanking(days = 7) {
    const logs = this.state.partnerReferrals || [];
    const now = Date.now();
    const cutoff = now - (Math.max(1, days) * 86400000);

    const bucket = new Map();
    for (const log of logs) {
      const ts = new Date(log.timestamp).getTime();
      if (!Number.isFinite(ts) || ts < cutoff) continue;
      const key = String(log.partnerName || '').trim() || 'unknown';
      const prev = bucket.get(key) || 0;
      bucket.set(key, prev + (Number(log.count) || 0));
    }

    const ranking = Array.from(bucket.entries())
      .map(([partnerName, referrals]) => ({ partnerName, referrals }))
      .sort((a, b) => b.referrals - a.referrals);

    const totalReferrals = ranking.reduce((acc, x) => acc + x.referrals, 0);
    const activePartners = ranking.length;

    return {
      days,
      totalReferrals,
      activePartners,
      ranking,
      generatedAt: new Date().toISOString(),
    };
  }

  buildPartnerWeeklyMessage(days = 7) {
    const report = this.getPartnerWeeklyRanking(days);
    const lines = [
      `🤝 <b>파트너 주간 랭킹 (${report.days}일)</b>`,
      `총 소개건수: ${report.totalReferrals}건 | 활동 파트너: ${report.activePartners}명`,
      '',
    ];

    if (!report.ranking.length) {
      lines.push('아직 기록된 파트너 소개건수가 없습니다.');
    } else {
      report.ranking.slice(0, 10).forEach((x, i) => {
        lines.push(`${i + 1}. ${x.partnerName} - ${x.referrals}건`);
      });
    }

    lines.push('');
    lines.push('기록 예시: node master-agent.js --add-partner=홍길동 --count=2');
    return lines.join('\n');
  }

  getPartnerPerformance(days = 30) {
    const now = Date.now();
    const cutoff = now - (Math.max(1, days) * 86400000);

    const referrals = new Map();
    const executions = new Map();

    for (const log of (this.state.partnerReferrals || [])) {
      const ts = new Date(log.timestamp).getTime();
      if (!Number.isFinite(ts) || ts < cutoff) continue;
      const key = String(log.partnerName || '').trim() || 'unknown';
      referrals.set(key, (referrals.get(key) || 0) + (Number(log.count) || 0));
    }

    for (const log of (this.state.partnerExecutions || [])) {
      const ts = new Date(log.timestamp).getTime();
      if (!Number.isFinite(ts) || ts < cutoff) continue;
      const key = String(log.partnerName || '').trim() || 'unknown';
      executions.set(key, (executions.get(key) || 0) + (Number(log.count) || 0));
    }

    const partners = new Set([...referrals.keys(), ...executions.keys()]);
    const rows = Array.from(partners).map(name => {
      const ref = referrals.get(name) || 0;
      const exe = executions.get(name) || 0;
      const conv = ref > 0 ? (exe / ref) * 100 : 0;
      let priority = 'C';
      if (ref >= 5 && conv >= 35) priority = 'A';
      else if (ref >= 3 && conv >= 20) priority = 'B';

      return {
        partnerName: name,
        referrals: ref,
        executions: exe,
        conversionRate: Number(conv.toFixed(1)),
        priority,
      };
    });

    rows.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority.localeCompare(a.priority);
      if (b.conversionRate !== a.conversionRate) return b.conversionRate - a.conversionRate;
      return b.executions - a.executions;
    });

    const recommendations = rows.slice(0, 5).map(x => {
      if (x.priority === 'A') {
        return `${x.partnerName}: 우선 협업 강화 (주 2회 접촉)`;
      }
      if (x.priority === 'B') {
        return `${x.partnerName}: 유지/육성 (주 1회 접촉)`;
      }
      return `${x.partnerName}: 메시지 개선 필요 (제안문/응답속도 점검)`;
    });

    return {
      days,
      rows,
      recommendations,
      generatedAt: new Date().toISOString(),
    };
  }

  buildPartnerPerformanceMessage(days = 30) {
    const report = this.getPartnerPerformance(days);
    const lines = [
      `📈 <b>파트너 전환율 리포트 (${report.days}일)</b>`,
      '기준: 소개건수 대비 실행건수',
      '',
    ];

    if (!report.rows.length) {
      lines.push('아직 집계할 파트너 데이터가 없습니다.');
    } else {
      lines.push('이름 | 소개 | 실행 | 전환율 | 우선순위');
      report.rows.slice(0, 10).forEach(x => {
        lines.push(`${x.partnerName} | ${x.referrals} | ${x.executions} | ${x.conversionRate}% | ${x.priority}`);
      });

      lines.push('');
      lines.push('추천 액션:');
      report.recommendations.forEach((r, i) => {
        lines.push(`${i + 1}. ${r}`);
      });
    }

    lines.push('');
    lines.push('실행 기록 예시: node master-agent.js --add-partner-exec=홍길동 --count=1');
    return lines.join('\n');
  }

  getSummary() {
    const now = new Date();
    const start = new Date(this.state.startDate + 'T00:00:00');
    const elapsedDays = Math.max(1, Math.floor((now - start) / 86400000) + 1);

    const target3m = this.state.goals.target3m;
    const target6m = this.state.goals.target6m;

    const pace3m = target3m / 90;
    const pace6m = target6m / 180;

    const expected3mToDate = Math.min(target3m, Math.round(elapsedDays * pace3m));
    const expected6mToDate = Math.min(target6m, Math.round(elapsedDays * pace6m));
    const remainingDays3m = Math.max(1, 90 - elapsedDays);
    const remainingDays6m = Math.max(1, 180 - elapsedDays);

    const actual = this.state.actualExecutions || 0;
    const remain3m = Math.max(0, target3m - actual);
    const remain6m = Math.max(0, target6m - actual);
    const dailyNeed3m = Math.ceil(remain3m / remainingDays3m);
    const dailyNeed6m = Math.ceil(remain6m / remainingDays6m);

    return {
      startDate: this.state.startDate,
      elapsedDays,
      actualExecutions: actual,
      target3m,
      target6m,
      expected3mToDate,
      expected6mToDate,
      gap3m: actual - expected3mToDate,
      gap6m: actual - expected6mToDate,
      remainingDays3m,
      remainingDays6m,
      dailyNeed3m,
      dailyNeed6m,
      monthlyNeedFor3m: Math.ceil(target3m / 3),
      monthlyNeedFor6m: Math.ceil(target6m / 6),
    };
  }

  getRecentCategories(count = 3) {
    const logs = this.state.runLogs || [];
    return logs
      .slice(-Math.max(1, count))
      .map(x => x.topicCategory)
      .filter(Boolean);
  }

  buildActionPlan() {
    const s = this.getSummary();
    let riskLevel = 'GREEN';
    if (s.gap3m <= -5) riskLevel = 'RED';
    else if (s.gap3m <= -2) riskLevel = 'YELLOW';

    const dailyExecTarget = Math.max(1, s.dailyNeed3m);
    const youtubePerWeek = dailyExecTarget >= 2 ? 4 : 3;
    const instaPerWeek = dailyExecTarget >= 2 ? 5 : 4;
    const partnerTouchesPerDay = riskLevel === 'RED' ? 6 : riskLevel === 'YELLOW' ? 4 : 3;
    const kakaoFollowUpsPerDay = riskLevel === 'RED' ? 8 : riskLevel === 'YELLOW' ? 5 : 3;
    const responseSlaMinutes = riskLevel === 'RED' ? 5 : 10;

    return {
      riskLevel,
      dailyExecTarget,
      weeklyTargets: {
        youtube: youtubePerWeek,
        instagram: instaPerWeek,
        partnerTouches: partnerTouchesPerDay * 7,
      },
      escalation: {
        enabled: riskLevel !== 'GREEN',
        mode: riskLevel === 'RED' ? 'EMERGENCY' : 'BOOST',
        partnerTouchesPerDay,
        kakaoFollowUpsPerDay,
        responseSlaMinutes,
      },
      todayChecklist: [
        `유튜브 쇼츠/릴스 핵심 주제 1개 발행`,
        `공인중개사 접촉 ${partnerTouchesPerDay}건 실행`,
        `카카오/전화 유입 응답 SLA ${responseSlaMinutes}분 이내 유지`,
        `카카오 재접촉 ${kakaoFollowUpsPerDay}건 실행`,
        `실행건수 발생 시 즉시 --add-exec 기록`,
      ],
    };
  }

  buildStatusMessage() {
    const s = this.getSummary();
    const sign3 = s.gap3m >= 0 ? '+' : '';
    const sign6 = s.gap6m >= 0 ? '+' : '';

    return (
      '📊 <b>실행건수 목표 추적</b>\n' +
      `시작일: ${s.startDate} | 경과: ${s.elapsedDays}일\n` +
      `실제 누적: ${s.actualExecutions}건\n` +
      `3개월 목표: ${s.target3m}건 (현재 기준 ${s.expected3mToDate}건, 차이 ${sign3}${s.gap3m})\n` +
      `6개월 목표: ${s.target6m}건 (현재 기준 ${s.expected6mToDate}건, 차이 ${sign6}${s.gap6m})\n` +
      `일일 필요 실행(3개월 기준): ${s.dailyNeed3m}건\n` +
      `월 필요 페이스: 3개월 ${s.monthlyNeedFor3m}건 / 6개월 ${s.monthlyNeedFor6m}건`
    );
  }
}

module.exports = GoalTracker;
