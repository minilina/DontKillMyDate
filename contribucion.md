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
* **Rol:** Artista 2D / UI
* **Tareas Realizadas:**
    * Diseño y animación del personaje principal (Idle, Run, Jump, Attack).
    * Creación del *tileset* para el nivel 1 (bosque) y nivel 2 (cueva).
    * Diseño de la interfaz de usuario (HUD): barra de vida y contador de monedas.
    * Diseño del logotipo del juego y pantalla de título.
* **Valoración General:**
    La calidad visual es excelente y coherente. Entregó todos los *assets* a tiempo y correctamente exportados para Unity/Godot. Mostró gran iniciativa proponiendo mejoras visuales en la UI.
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

### 👤 @lazy_coder_x (Lucas Suárez)
* **Rol:** Programador de UI / Soporte
* **Tareas Realizadas:**
    * Programación de la funcionalidad de los botones del Menú Principal.
    * Ajustes menores en los créditos del juego.
* **Valoración General:**
    Su contribución fue baja en comparación con el resto del equipo. Faltó a varias reuniones de *daily scrum* y la funcionalidad del menú tuvo que ser refactorizada por @dev_master_99 debido a errores de lógica.
* **Puntuación:** ⭐⭐☆☆☆ (2/5)

---

### 👤 @sergiicl (Sergio Casanova)
* **Rol:** Programador de UI / Soporte
* **Tareas Realizadas:**
    * Programación de la funcionalidad de los botones del Menú Principal.
    * Ajustes menores en los créditos del juego.
* **Valoración General:**
    Su contribución fue baja en comparación con el resto del equipo. Faltó a varias reuniones de *daily scrum* y la funcionalidad del menú tuvo que ser refactorizada por @dev_master_99 debido a errores de lógica.
* **Puntuación:** ⭐⭐☆☆☆ (2/5)

---

## 📊 Resumen de Puntuaciones

| Usuario (GitHub)    | Rol             | Puntuación | Puntuación como número |
|:--------------------|:----------------|:----------:|:----------------------:|
| **@minilina**  | Programación    |   ⭐⭐⭐⭐⭐ |           5            |
| **@meriwen** | Arte / UI       |   ⭐⭐⭐⭐⭐ |           5            |
| **@didimax89** | Arte / UI       |   ⭐⭐⭐⭐⭐ |           5            |
| **@laurimba**     | Audio / Diseño  |   ⭐⭐⭐⭐☆ |           4            |
| **@**     | Audio / Diseño  |   ⭐⭐⭐⭐☆ |           4            |
| **@sergiicl**   | Programación UI |   ⭐⭐☆☆☆  |           2            |
