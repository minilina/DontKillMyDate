# 📄 Informe de Contribución: Don't Kill My Date

**Fecha del informe:** 26 de Mayo, 2026
**Estado del proyecto:** Finalizado

---

## 👥 Desglose por Miembros
### 👤 @minilina (Alba Gómez)
* **Rol:** Programadora / Gameplay / Artista 2D
* **Tareas Realizadas:**
    * Diseño y creación de todos los sprites de personajes: cuerpos, ropa, pelo, ojos,
      bocas, narices, orejas, cejas y features especiales por raza.
    * Diseño del pergamino de resumen diario junto a los iconos
      de corazones y estrellas.
    * Implementación de `NPCGenerator`: genera aleatoriamente los datos de aspecto
      de los clientes normales, seleccionando tono de piel, peinado, color, ojos,
      ropa por raza, etc.
    * Implementación de la clase `NPC`: recibe los datos de aspecto —ya sean
      generados aleatoriamente por `NPCGenerator` o definidos fijamente en
      `scriptedNpcs.json`— y ensambla y renderiza todas las capas del personaje.
    * Implementación del sistema de diálogos dinámicos y configuración narrativa
      completa: `CustomerFlowManager`, `diccionario.json`, `daysConfig.json`.
    * Implementación de `scriptedNpcs.json`: no solo los diálogos y lore de cada
      personaje especial, sino también la definición de su aspecto fijo por capas.
    * Desarrollo del flujo completo de atención al cliente (customer flow),
      desde la entrada del NPC hasta la entrega de la poción.
    * Implementación de la interfaz de diálogos: resaltado de palabras clave
      con color diferenciado y animación, con enlace directo a la nota de la cocina.
   * Implementación de los finales malos y buenos del juego: `gameOver`
* **Valoración General:**.

  Valoración escrita por `@lucass-05`:
  
  Alba ha sido de las personas más involucradas en el desarrollo del juego.
  
  Han destacado sus `diseños de personajes`, que han sido muy bonitos todos y con gran `escalabilidad` (al poder crear muchísimas variaciones de personajes con su diseño modular aleatorio). También ha sido la desarrolladora detrás de las `historias de todos los NPC` scripteados del juego, así como los posibles `finales del juego`, por lo que gran parte del disfrute del lore del juego es gracias a su participación. Además nos ha ayudado con nuestras partes siempre que se lo hemos pedido, siendo una `compañera ejemplar`.

  Ha participado en `diseño` mucho con `@laurimba`, colaborado conmigo al facilitarme todos los dibujos que necesité para hacer la versión topdown de los npcs así como sus dialogos en el topdown. Además, ha sido muy activa en el grupo de whatsapp ayudando a todos los demas colaboradores.

  Valoración escrita por `@sergiicl`:

 Alba ha sido en mi opinión ha sido uno de los pilares principales de este proyecto, ha dedicado una gran parte de tiempo dibujando los personajes y pensando las historias de los personajes principales además de desarrollar toda la mecánica de los `.json` facilitando el ciclo del juego. Siento que desde se añadió la visión sobre el futuro del proyecto ha estado bastante claro y hemos podido continuar con mucha más fluidez y claridad. Cabe también destacar su compañerismo y saber coordinar al grupo.


  
* **Puntuación:** ⭐⭐⭐⭐⭐ (5/5)

---

### 👤 @meriwen (María Bravo)
* **Rol:** Programadora
* **Tareas Realizadas:**
  
* *Sistema de Tutorial Completo:*
    * ​Diseño e implementación de la arquitectura lógica del tutorial.
    * ​Desarrollo de la interfaz de usuario (Vista/UI) y su integración con los sistemas del juego.
    * Programación de los disparadores (triggers) y flujo de aprendizaje para el jugador.
 
* *Arquitectura Base del Juego:*
    * ​Diseño y desarrollo del esqueleto técnico para el Sistema de Días (gestión del tiempo/bucles).
    * ​Creación de la estructura base del Sistema de Diálogos (gestión de nodos o flujos de texto).

* *​Escena de Introducción:*
    * ​Implementación y lógica del flujo inicial del juego.

* **Valoración General:**
El sistema de tutorial y la introducción quedaron completamente funcionales y se integran muy bien con la estética y flujo del juego. Por otro lado, la entrega del esqueleto básico para los sistemas de días y diálogos permitió establecer los cimientos técnicos necesarios, sirviendo como base sólida para que el equipo pueda continuar expandiendo y puliendo estas mecánicas en las siguientes etapas.

* **Puntuación:** ⭐⭐⭐⭐⭐ (5/5)

---

### 👤 @didimax89 (Diego Barba)
* **Rol**: Programador / Level Designer / Artista 2D / Gameplay 
* **Tareas Realizadas:**
    * Implementación e integración de todos los mapas TopDown creados en Tiled, gestionando la carga de capas, colisiones y objetos.
    * Implementación de herencia compartida para todos los mapas a partir de topDownScene y abstracción de todos los métodos que se habían usado para un único mapa.
    * Creación del sistema de interacciones tanto con objetos como con UI, incluyendo un cursor inteligente que detecta objetos usables.
    * Implemetación de un sistema complejo de cursores personalizados en todo el proyecto, no solo en las escenas topDown.
    * Implementación del sistema de activación interactiva con la tecla "E" para la comunicación con NPCs y objetos.
    * Diseño de físicas complejas y profundidad (Z-Sorting), aplicando transparencias automáticas a techos y árboles cuando el jugador camina detrás de ellos.
    * Gestión de diferentes alturas de colisión (zElevacion) para permitir al jugador navegar por encima y por debajo de puentes.
    * Lógica de evolución del mundo, donde el mapa principal cambia dinámicamente a una versión mejorada cuando el jugador supera los 100 puntos de reputación.
    * Implementación de la mecánica de cuidado de huertos con animaciones de riego por secuencias.
    * Creación de zonas de transición seguras entre escenarios mediante interfaces de confirmación.
    * Creación de "colliders" compuestos y muros invisibles dinámicos para adaptar las cajas de colisión (hitboxes) a edificios con formas asimétricas (en "L") procedentes de Tiled.
    * Adaptación del sistema de "NavMesh" para soportar múltiples alturas, creando mallas de navegación independientes para el suelo y el puente, evitando que el algoritmo de búsqueda de caminos colapsara.
    * Diseño artístico e ilustración completa del mostrador de la tienda.
    * Ilustración de los frames y diseño visual de la animación de regar del personaje principal.
    * Desarrollo e implementación de la clase del jugador (player.js) junto con Lucas, programando su sistema de movimiento base y la lógica de la animación de riego.
    * Soporte para solucionar bugs + playtesting.
    * Grabacion del vídeo explicativo junto con Alba y edición e implementación del vídeo.

* **Valoración General:**
    Estoy muy orgulloso del trabajo que he realizado. A lo largo del desarrollo, he buscado aportar tanto a nivel técnico como artístico, encargándome del diseño del mostrador de la tienda y la animación de regar del personaje. Mi trabajo en la clase player sirvió como base del movimiento sobre la que luego pudimos iterar junto con '@lucass-05'.

En el apartado de programación, me encargué de crear la arquitectura del mapa. He implementado sistemas inmersivos como el sistema visual del cursor y transparencias, dándole mucho mimo a la estética y a que no hubiesen errores o pequeños bugs. Además, dediqué mucho esfuerzo a solucionar problemas complejos de físicas, como gestionar las diferentes alturas en los puentes aislando las mallas de navegación, o ajustar los colliders asimétricos de los edificios.

Mi colaboración con '@lucass-05' en la parte TopDown fue clave para unificar los mapas con las mecánicas de juego de los NPCs. Ha sido un proyecto exigente, pero me considero una persona resolutiva y que ha no ha tenido problemas para echar horas, que siempre ha estado dispuesta a pulir cada parte del código y del mapa hasta conseguir que la experiencia del jugador fuese la deseada.

* **Puntuación:** ⭐⭐⭐⭐⭐ (5/5)

---

### 👤 @laurimba (Laura Valles)
* **Rol:** Programadora / Disñadora / Artista 2D
* **Tareas Realizadas:**
    * Diseño artístico e ilustración de la `cocina` y de todos sus objetos interactivos (frascos, ingredientes, cuencos y herramientas).
    * Ilustración del sprite del `Libro de Alquimia` abierto y sus etiquetas, y de la carta para la escena introductoria `Letter`.
    * Programación completa de todas las mecánicas de la cocina (`kitchen.js`), integrando el sistema de `Drag & Drop` para manipular objetos, la lógica de la mesa de trabajo (plato de mezclas y papelera) y el sistema interactivo de ayudas visuales (bordes iluminados y flechas indicativas).
    * Programación completa de la lógica del caldero (`cauldron.js`) y del control de su barra de temperatura.
    * Diseño y animación completa del personaje del `fuego`, incluyendo sus expresiones.
    * Programación de los bocadillos de texto y frases dinámicas que dice el fuego de forma aleatoria.
    * Ilustración y programación completa del minijuego de cortar ingredientes en la cocina (`cuttingMinigame.js`).
    * Ilustración fondo del minijuego de machacar ingredientes en la cocina (`mortar Minigame.js`).
    * Desarrollo en `GameState.js` del sistema que calcula la puntuación y la calidad de las pociones entregadas, restando puntos por cada fallo cometido.
    * Programación del sistema de `reputación` según la calidad y el tiempo de la poción.
    * Implementación del sistema de guardado automático con `localStorage` para guardar de forma permanente el día actual, la reputación y el progreso de la historia.
    * Diseño y programación de la página web del videojuego utilizando HTML y CSS.

* **Valoración General:**

  Valoración escrita por `@lucass-05`:

  Laura ha sido también una desarrolladora clave en este juego. Han destacado sus `diseños muy cuidados` y `adorables` que aportan muchísimo encanto al juego.

   Se ha encargado del `funcionamiento de la cocina`, parte indudablemente principal del juego,  donde movemos todos los `ingredientes`, escogemos `frascos` y ajustamos `temperaturas`, aspecto completamente principal del juego y que hace que la experiencia sea entretenida. Además también participó en desarrollar el avance del juego por `reputación`. Por ambos motivos, el `core-loop` del juego no tendría sentido sin su aportación.
  
  Podríamos destacar su `diseño de la cocina`, que es totalmente acogedora y engancha al jugador a esta historia, además de todos los pequeños `detalles e ingredientes` con los que debemos trastear para elaborar las pociones. Es también la desarrolladora del carismático `personaje de fuego` que nos guía en el juego. Este personaje nos va diciendo distintas `frases enternecedoras` y tiene unas `animaciones adorables`. Laura ha sido una gran ayuda para todos con su dominio de `libresprite`. Además nos aconsejó en todos los diseños del juego.

   Su atención a todos los detalles estéticos hacen que el juego deje una `huella` en el jugador, siendo la estética del juego posiblemente su aspecto más característico y reconocible. 

   Valoración escrita por `@sergiicl`:

   Otro de los pilares principales del proyecto. Ha sido responsable de la clase `kitchen` en su totalidad, tanto el arte, sprites, animaciones, mecánicas (desarollo e implementación), perfeccionando hasta el más último detalle. Su implementación de `cuttingMinigame` personalmente me ayudo bastante para el desarrollo del `mortarMinigame` además de hacer el arte que utilicé en él.

* **Puntuación:** ⭐⭐⭐⭐⭐ (5/5)

---

### 👤 @lucass-05 (Lucas Suárez)
* **Rol:** Programador/ Diseño animaciones 2D/ Redacción de diálogos
* **Tareas Realizadas:**
    * Diseño del `personaje` al completo, desde sus animaciones, como sus funcionalidades de         movimiento.
    * Integración completa del `navmesh` para el movimiento del personaje en los mapas topDown de Tiled a través de `click and go` (permitiendo también el movimiento con `wasd`).
    * Creación de la escena abstracta `stoppableScene` que permite abrir el `menu` desde             cualquier escena que la herede tanto con `ESC` como con el botón superior derecha.
    * Creación de la escena `dialogueScene` que permite la dinámica de conversación con personajes en el `topDown`.
    * Implementación del `menú`, junto con sus funcionalidades de `mute` y `pantalla completa`
    * Diseño de las `animaciones topDown` de personajes, de todos los `scriptedNPCs `                  desbloqueables en formato pequeño (los que aparecen en el mapa), así como las                funcionalidades de conversar con ellos y desbloquearlos.
    * Implementación de la mecánica de conversación con la `madre`, con sus diferentes diálogos que se desbloquean cuanto más hablemos con ella.
    * Colaboración en la redacción de los diálogos de todos los `scriptedNpcs` e integración de sus funcionalidades del topdown a las funcionalidades que ya teníamos en escenas como `store`, reutilizando codigo como el de `DialogueManager` consiguiendo un código más extensible y compacto.
* **Valoración General:**

    Me enfoqué totalmente en el diseño de la parte `topDown` del juego, metiendo dinámicas divertidas como la `conversación con los personajes` y su `desbloqueo`, así como funcionalidades de manejo como el `navmesh` y el comportamiento de `player`. Diseñé muchas `animaciones 2d` del personaje principal y de los NPC (versión topDown) y metí funcionalidades generales como todo lo relacionado con el `menú de pausa` y las `escenas de diálogo` con personajes. Además redacté unos cuantos `diálogos` relacionados con el lore del juego.

  Colaboré principalmente con `@didimax89` en la parte topdown por su implicación en los mapas añadiendo juntos muchas funcionalidades, y con `@minilina` en los apartados de los NPC al haber creado ella todos sus diseños y sus personalidades en los diálogos, además de sus mecánicas especiales (crecer el gnomo o las alas del hada). Inspirándome en ello implementé sus interacciones en el `topdown` y sus animaciones en pequeñito.
  Finalmente conseguí cohesionar muchas partes del codigo sin añadir muchos archivos innecesarios, al:

  ** Añadir la informacion de los npcs del topdown en el mismo archivo scriptedNPC

  ** Adaptarme al Tiled para las funcionalidades de navmesh y de interacción, sin modificar el propio Tiled.

  ** Seguir la estética de los diálogos y botones para tanto el `menu` como las `conversaciones con los npc`, reutilizando y modificando clases como `dialogueManager` y `dialogueUI` , que inicialmente estaban pensadas para `store`, pero consiguiendo adecuarlas a otras partes del juego sin estropear su funcionamiento en `store`.

Valoración escrita por `@sergiicl`:

  Gracias al esfuerzo e insistencia de Lucas hemos podido implementar el Navmesh y movimiento del protagonista en el `topDownScene` casi a la perfección dentro de lo permitido con las herramientas posibles, además de las interacciones con los personajes principales en la ciudad con ellos. Muy persistente y trabajador.

* **Puntuación:** ⭐⭐⭐⭐⭐ (5/5)

---

### 👤 @sergiicl (Sergio Casanova)
* **Rol:** Programador / Composición y Productor
* **Tareas Realizadas:**
    * Desarrollo completo de la clase `book`, implementando toda su lógica de interacción, navegación entre pestañas y conexión con las mecánicas jugables. El sistema fue diseñado para funcionar como apoyo constante al jugador durante la preparación de pociones, integrando información dinámica sobre afinidades, ingredientes, colores y razas sin romper el flujo de gameplay.
    * Composición y producción de la banda sonora original del juego. La música fue planteada para acompañar el ritmo relajado de exploración y contrastar con la tensión ligera de la cocina y los minijuegos.
    * Diseño, implementación e integración de todos los efectos de sonido y sistemas de ambientación sonora del juego, trabajando especialmente sobre `topDownScene`, `kitchen` y escenas generales del proyecto. Se añadieron sonidos contextuales para interacciones, interfaces, cocina, diálogos, fuego, mezclas y elementos ambientales del pueblo, buscando mejorar el feedback del jugador y dar más vida al entorno.
    * Configuración completa del `mortarMinigame`, ajustando parámetros de aparición, ritmo, dificultad y penalizaciones para conseguir un equilibrio entre desafío y accesibilidad. También se trabajó en el feedback visual y sonoro de las interacciones para reforzar la sensación de rapidez y precisión durante la preparación de ingredientes.
    * Colaboración en la implementación de las mecánicas de drag & drop de la cocina, ayudando en la integración de objetos interactivos, validación de zonas de interacción y cohesión general entre ingredientes, herramientas y caldero dentro de las escenas de `kitchen`.
    * Programación de distintas funcionalidades de interfaz y navegación, incluyendo los botones del `MainMenu`, ajustes visuales y comportamiento de menús. También participé en el desarrollo de la **pantalla de inicio (`StartMenu`)**, diseñando e implementando la experiencia inicial del jugador, la navegación entre opciones y la transición entre escenas principales del juego.
    * Programación completa de la escena `start`, incluyendo la transición hacia las escenas principales y diseño e implementación del fondo animado de la pantalla de inicio.
    * Participación parcial en el desarrollo del **final intermedio** del juego, colaborando en su integración narrativa como en la implementación técnica de eventos, escenas y transiciones relacionadas con la progresión de la historia.

* **Valoración General:**
    
  
* **Puntuación:** ⭐⭐⭐⭐☆ (4/5)

---

## 📊 Resumen de Puntuaciones

| Usuario (GitHub)    | Rol             | Puntuación | Puntuación como número |
|:--------------------|:----------------|:----------:|:----------------------:|
| **@minilina**  | Programadora / Gameplay / Artista 2D    |   ⭐⭐⭐⭐⭐ |           5            |
| **@meriwen** |Programadora       |   ⭐⭐⭐⭐⭐ |           5            |
| **@didimax89** | Programador / Level Designer / Artista 2D / Gameplay |   ⭐⭐⭐⭐⭐ |           5            |
| **@laurimba**     | Programadora / Diseñadora / Artista 2D  |   ⭐⭐⭐⭐⭐ |           5            |
| **@lucass-05**     | Programador/ Diseño animaciones 2D/ Redacción de diálogos  |   ⭐⭐⭐⭐⭐ |           5            |
| **@sergiicl**   | Programación / Compositor y Productor |   ⭐⭐⭐⭐☆  |           4            |
