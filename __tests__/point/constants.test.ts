import { DEFAULT_POINT_IMAGE } from '@/components/point/constants';

describe('point constants', () => {
  it('exports the default point image URL', () => {
    expect(DEFAULT_POINT_IMAGE).toBe(
      '/images/image.png'
    );
  });
});
