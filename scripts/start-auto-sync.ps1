$ErrorActionPreference = 'Stop'

Set-Location 'C:\Users\aplus\Desktop\petcare-phase2-complete'

# Start long-running auto sync watcher (every 5 minutes)
npm run git:auto-sync:watch
