/**
 * Call this to compute font sizes for OrderedWordCloud and Word2VecChart
 */
export const LINE_VIEW = 'line';
export const STACKED_VIEW = 'stacked';

export default function fontSizeComputer(term, extent, sizeRange) {
  const size = sizeRange.min + (((sizeRange.max - sizeRange.min)
          * (Math.log(term.tfnorm) - Math.log(extent[0]))) / (Math.log(extent[1]) - Math.log(extent[0])));
  return size;
}
