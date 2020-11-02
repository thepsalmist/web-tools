import * as d3 from 'd3';

// @see http://colorbrewer2.org/#type=diverging&scheme=RdBu&n=5
export const PARTISANSHIP_COLORS = ['#0571b0', '#92c5de', '#666666', '#f4a582', '#ca0020'];

export function mapD3Top10Colors(idx) {
  if (idx <= -1) return 0;
  return d3.schemeCategory10[idx % 10];
}
