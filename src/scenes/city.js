import Phaser from 'phaser';
import topDownScene from './topDownScene.js';

export default class City extends topDownScene {
    constructor() {
        super('city');
    }

    preload() { }

    create(data = {}) {
        this.initScene('ciudad');

        // CONFIGURAR PROFUNDIDADES (Lo que vaya por encima del jugador)

        // 3. JUGADOR Y UI
        const startX = data.spawnX ?? 800; // Coordenadas por defecto al entrar al juego
        const startY = data.spawnY ?? 600;

        this.setupPlayer(startX, startY);
        this.setupUI(); 

        // 4. DECORACIÓN DINÁMICA (Si tienes capas de flores, etc.)
        // this.crearDecoracionDinamica(['Objetos/SpawnFlores']);

        // =======================================================
        // 5. HOVER DEL RATÓN
        // =======================================================
        this.hover([
            // Ejemplo: { capa: capaEdificios, ids: [100, 101] } // Puertas
        ]);

        // =======================================================
        // 6. SISTEMA UNIVERSAL DE INTERACCIONES (BOTÓN [E] Y CLIC)
        // =======================================================
        this.crearSistemaInteraccion([
            /* EJEMPLO DE PUERTA A LA TIENDA
            {
                capa: capaEdificios,
                ids: [500], // ID de la puerta para la E
                idsClic: [500, 501, 502], // IDs de la puerta para el ratón
                tipo: 'tienda',
                offsetX: 0, 
                offsetY: -10
            },
            EJEMPLO DE CARTEL
            {
                capa: capaEdificios,
                ids: [600],
                tipo: 'cartel',
                offsetX: 0, 
                offsetY: -20
            }
            */
        ], (tipo, tile) => {
            // Lógica de lo que pasa al interactuar
            if (tipo === 'tienda') {
                // this.cambiarEscena('store', { returnX: tile.x, returnY: tile.y + 30 });
            } else if (tipo === 'cartel') {
                // Lógica para mostrar un texto en pantalla
                console.log("Leyendo cartel...");
            }
        });

        // =======================================================
        // 7. CREACIÓN DE OBJETOS DINÁMICOS CON COLISIONES
        // =======================================================
        const configObjetosCiudad = {
            /* EJEMPLOS:
            'farola': { key: 'farola_img', w: 10, h: 10, ox: -5, oy: -5, centrarOffset: true },
            'banco':  { key: 'banco_img',  w: 32, h: 16, ox: -16, oy: -8, centrarOffset: true }
            */
        };
        // Si tienes una capa de objetos en Tiled llamada 'SpawnCiudad'
        // this.grupoObjetosCiudad = this.crearObjetos('Objetos/SpawnCiudad', configObjetosCiudad);

        // =======================================================
        // 8. TRANSPARENCIAS
        // =======================================================
        // this.activarTransparencias([this.grupoObjetosCiudad]);

        // =======================================================
        // ZONA DE TRANSICIÓN A LA CASA (Borde Izquierdo)
        // =======================================================
        // Creamos una zona invisible pegada al borde izquierdo del mapa
        const zonaCasaX = this.map.widthInPixels; 
        const zonaCasaY = 320;
        const zonaCasa = this.add.zone(zonaCasaX, zonaCasaY, 16, 48).setOrigin(0.5, 1);
        this.physics.add.existing(zonaCasa, true);
        this.physics.add.overlap(this.player, zonaCasa, () => {
            this.cambiarEscena('house', { spawnX: 32, spawnY: 464});
        });

        // HERRAMIENTA DE DEBUG
        this.debugTiles([
            // { nombre: "EDIFICIOS", capa: capaEdificios }
        ]);
    }
}