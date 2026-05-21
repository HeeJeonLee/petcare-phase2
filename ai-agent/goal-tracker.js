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

    const actual = this.state.actualExecutions || 0;

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
      monthlyNeedFor3m: Math.ceil(target3m / 3),
      monthlyNeedFor6m: Math.ceil(target6m / 6),
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
      `월 필요 페이스: 3개월 ${s.monthlyNeedFor3m}건 / 6개월 ${s.monthlyNeedFor6m}건`
    );
  }
}

module.exports = GoalTracker;
