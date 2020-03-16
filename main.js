"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ascii_1 = require("ascii");
var ascii_2 = require("ascii");
var ascii_3 = require("ascii");
var ascii_4 = require("ascii");
var ascii_5 = require("ascii");
var ascii_6 = require("ascii");
var worldConfig = require("./world.json");
var GameState;
(function (GameState) {
    GameState[GameState["Play"] = 0] = "Play";
    GameState[GameState["Look"] = 1] = "Look";
    GameState[GameState["Menu"] = 2] = "Menu";
})(GameState || (GameState = {}));
var game = /** @class */ (function (_super) {
    __extends(game, _super);
    function game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.menus = {};
        _this.activeMenu = null;
        _this.intermediateKey = null;
        return _this;
    }
    game.prototype.load = function () {
        // TODO: Check for an existing save in localStorage
        var _this = this;
        this.state = GameState.Menu;
        this.world = ascii_1.Importer.importWorld(worldConfig);
        this.renderer = new ascii_3.Renderer();
        this.renderer.addWindow('game', ascii_6.Menu.width, ascii_6.Menu.height, true);
        // initially render everything for the first time
        this.renderer.renderRoom(this.world.getActiveRoom(), this.renderer.windows['game'].getContext());
        this.world.getActiveRoom().getActors().forEach(function (actor) {
            if (actor instanceof ascii_4.Player && _this.world.getPlayer() == null) {
                _this.world.setPlayer(actor);
                _this.renderer.renderGameObject(actor, _this.renderer.windows['game'].getContext());
                _this.renderer.renderObjectContext(actor, _this.world.getActiveRoom(), _this.renderer.windows['game'].getContext());
                return;
            }
        });
    };
    game.prototype.update = function (key) {
        if (this.state == GameState.Play) {
            if (!(ascii_5.IO.validGameControls.indexOf(key) > -1))
                return;
            this.world.getPlayer().receiveKeyInput(key);
            this.world.takeTurn();
        }
    };
    game.prototype.draw = function () {
        var _this = this;
        if (this.state == GameState.Play) {
            // this.renderer.renderRoom(this.world.getActiveRoom(), this.window.getContext());
            // this.renderer.renderView(this.world.getPlayer(), this.world.getActiveRoom(), this.window.getContext());
            // Draw everything /around/ each actor
            this.world.getActiveRoom().getActors().forEach(function (actor) {
                _this.renderer.renderObjectContext(actor, _this.world.getActiveRoom(), _this.renderer.windows['game'].getContext());
            });
            // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
            this.world.getActiveRoom().getActors().forEach(function (actor) {
                _this.renderer.renderGameObject(actor, _this.renderer.windows['game'].getContext());
            });
        }
    };
    return game;
}(ascii_2.Game));
var g = new game();
g.load();
ascii_5.IO.genericKeyBinding(function (key) {
    g.update(key);
    g.draw();
});
