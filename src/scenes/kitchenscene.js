const order = this.registry.get("currentOrder");
console.log(order.requirements);

// HACER LO QUE SEA

this.scene.stop("kitchen");
this.scene.wake("store");