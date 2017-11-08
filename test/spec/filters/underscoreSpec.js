'use strict';

describe('underscoreFilter', function() {
  var underscore;

  beforeEach(
    inject(function(underscoreFilter){
      underscore = underscoreFilter;
    })
  );

  it('should return stuff and things', function() {
    expect(underscore('Foo.bar')).toBe('Foo_bar');
    expect(underscore('.Foo.bar.')).toBe('_Foo_bar_');
    expect(underscore('Foo.bar.baz')).toBe('Foo_bar_baz');
    expect(underscore('a.b-c_d.e()')).toBe('a_b-c_d_e()');
  });
});
