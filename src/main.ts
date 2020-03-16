import { Importer } from "ascii";
import { Game } from 'ascii';
import { World } from 'ascii';
import { Renderer } from 'ascii';
import { Player } from 'ascii';
import { IO } from 'ascii';
import { Menu, MenuOption } from 'ascii';
import { GameObject } from 'ascii';

import * as worldConfig from "./world.json";

enum GameState {
    Play,
    Look,
    Menu
}
class game extends Game {

    menus: Record<string, Menu> = {};
    activeMenu: string = null;

    renderer: Renderer;

    world: World;

    state: GameState;
    lookCursor: GameObject;

    intermediateKey = null;

    load() {

        // TODO: Check for an existing save in localStorage

        this.state = GameState.Menu;
        this.world = Importer.importWorld(worldConfig);

        this.renderer = new Renderer();
    
        
        this.renderer.addWindow('game', 50, 30, true);


        // initially render everything for the first time

        this.renderer.renderRoom(this.world.getActiveRoom(), this.renderer.windows['game'].getContext());


        this.world.getActiveRoom().getActors().forEach(actor => {

            if (actor instanceof Player && this.world.getPlayer() == null) 
            {
                this.world.setPlayer(actor);

                this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());
                this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.renderer.windows['game'].getContext());
            } else {
                this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());
                this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.renderer.windows['game'].getContext());
            }
        });

    }

    update(key: string) {


        if (this.state == GameState.Play) {

            if (!(IO.validGameControls.indexOf(key) > -1)) return;

            this.world.getPlayer().receiveKeyInput(key);
            this.world.takeTurn();
        }
    }

    draw() {

        if (this.state == GameState.Play) {
            // this.renderer.renderRoom(this.world.getActiveRoom(), this.window.getContext());
            // this.renderer.renderView(this.world.getPlayer(), this.world.getActiveRoom(), this.window.getContext());

            // Draw everything /around/ each actor
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.renderer.windows['game'].getContext());
            });

            // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());
            });
        }
        
    }
}

let g = new game();
g.load();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
})
