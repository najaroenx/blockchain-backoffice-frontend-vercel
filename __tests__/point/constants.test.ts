import { DEFAULT_POINT_IMAGE } from '@/components/point/constants';

describe('point constants', () => {
  it('exports the default point image URL', () => {
    expect(DEFAULT_POINT_IMAGE).toBe(
      'https://raw.seadn.io/files/5989b6c83f9e0457bb6f4e962cd225f5.png'
    );
  });
});
