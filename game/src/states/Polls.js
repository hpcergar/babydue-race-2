export default class extends Phaser.State {

	create() {
        window.location.replace("/calendar" + document.location.search);
	}
}
