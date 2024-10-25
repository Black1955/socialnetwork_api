export var bd;
(function (bd) {
    bd[bd["postgres"] = 0] = "postgres";
    bd[bd["sqlite"] = 1] = "sqlite";
})(bd || (bd = {}));
