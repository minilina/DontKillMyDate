# 📄 Informe de Contribución: Don't Kill My Date

**Fecha del informe:** 29 de Enero, 2026
**Estado del proyecto:** [Ej: Beta / Finalizado / Sprint 3]

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
* **Rol:** Diseño de Sonido / Level Design
* **Tareas Realizadas:**
    * Composición del tema principal y música de batalla.
    * Creación de efectos de sonido (SFX) para salto, golpe y recolección de items.
    * Diseño del layout del Nivel 1.
* **Valoración General:**
    El audio encaja muy bien con la estética. Sin embargo, hubo un retraso en la entrega del diseño del Nivel 1, lo que obligó a los programadores a usar prototipos grises (placeholders) durante más tiempo del previsto.
* **Puntuación:** ⭐⭐⭐⭐☆ (4/5)

---

### 👤 @laurimba (Laura Valles)
* **Rol:** Programador de UI / Soporte
* **Tareas Realizadas:**
    * Programación de la funcionalidad de los botones del Menú Principal.
    * Ajustes menores en los créditos del juego.
* **Valoración General:**
    Su contribución fue baja en comparación con el resto del equipo. Faltó a varias reuniones de *daily scrum* y la funcionalidad del menú tuvo que ser refactorizada por @dev_master_99 debido a errores de lógica.
* **Puntuación:** ⭐⭐☆☆☆ (2/5)

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

  ** Adaptarme al Tiled para las funcionalidades navmesh y de interacción y las funcionalidades sin modificarlo

  ** Seguir la estética de los diálogos y botones para tanto el menu como las conversaciones con los npc reutilizando y modificando clases como `dialogueManager` y `dialogueUI` , que inicialmente estaban pensadas para `store`, pero consiguiendo adecuarlas a otras partes del juego sin estropear su funcionamiento en `store`.


* **Puntuación:** ⭐⭐⭐⭐⭐ (5/5)

---

### 👤 @sergiicl (Sergio Casanova)
* **Rol:** Programador de UI / Soporte
* **Tareas Realizadas:**
    * Programación de la funcionalidad de los botones del Menú Principal.
    * Ajustes menores en los créditos del juego.
* **Valoración General:**
    
  
* **Puntuación:** ⭐⭐☆☆☆ (2/5)

---

## 📊 Resumen de Puntuaciones

| Usuario (GitHub)    | Rol             | Puntuación | Puntuación como número |
|:--------------------|:----------------|:----------:|:----------------------:|
| **@minilina**  | Programadora / Gameplay / Artista 2D    |   ⭐⭐⭐⭐⭐ |           5            |
| **@meriwen** |Programadora       |   ⭐⭐⭐⭐⭐ |           5            |
| **@didimax89** | Arte / UI       |   ⭐⭐⭐⭐⭐ |           5            |
| **@laurimba**     | Audio / Diseño  |   ⭐⭐⭐⭐☆ |           4            |
| **@lucass-05**     | Programador/ Diseño animaciones 2D/ Redacción de diálogos  |   ⭐⭐⭐⭐⭐ |           5            |
| **@sergiicl**   | Programación UI |   ⭐⭐☆☆☆  |           2            |
