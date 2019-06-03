angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('zh_CN', {"CN":"中文","EN":"英文","Language":"语言"});
/* jshint +W100 */
}]);