import { formatNumber } from '../../../utils';
import CHARA_NAME from '../../../CHARA_NAME';

export default {
  formatBoss(row) {
    const bossMap = new Map([
      ['1', '一王'],
      ['2', '二王'],
      ['3', '三王'],
      ['4', '四王'],
      ['5', '五王'],
      ['6', 'EX1'],
    ]);
    return bossMap.get(row.boss);
  },
  formatWeek(row) {
    const weekMap = new Map([
      ['1', '一周目'],
      ['2', '二周目'],
    ]);
    return weekMap.get(row.week);
  },
  formatStage(row) {
    const stageMap = new Map([
      ['1', '一阶段（非狂暴）'],
      ['2', '二阶段（狂暴）'],
    ]);
    return stageMap.get(row.stage);
  },
  formatLineUp(row) {
    const { lineUp } = row;
    if (lineUp) {
      const lineUpSplit = lineUp.split(',');
      return lineUpSplit
        .map((key) => {
          if (CHARA_NAME[key]) return CHARA_NAME[key].join(' ');
          return '';
        })
        .join('\n');
    }
    return '';
  },
  formatLineUpSimple(row) {
    const { lineUp } = row;
    if (lineUp) {
      const lineUpSplit = lineUp.split(',');
      return lineUpSplit
        .map((key) => {
          return CHARA_NAME[key][0];
        })
        .join(' ');
    }
    return '';
  },
  formatNumber(row) {
    const { hurt } = row;
    return formatNumber(hurt, { returnObj: false }) || '';
  },
};
