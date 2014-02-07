
function Kickoff() {
	this.inPorts = ['Object *self', 'int arg'];
	this.outPorts = ['int'];
}

function Interrupt(name) {
	this.name = name;
	this.outPorts = ['int'];
}

function Variable(name, value) {
	this.name = name || 'unused';
	this.value = value || 0;
}

function Method(name) {
	this.inPorts = ['Object *self', 'int arg'];
	this.outPorts = ['int'];
	this.wcet = 0;
}

// function Sync() {}  - is internal 

function Async() {
	this.inPorts = ['object','arg'];
	this.outPorts = ['object', 'arg'];
}

function After() {
	this.inPorts = ['delay','object','arg'];
	this.outPorts = ['object', 'arg'];
}

function Before() {
	this.inPorts = ['deadline', 'object', 'arg'];
	this.outPorts = ['object', 'arg'];
}

function Send() {
	this.inPorts = ['delay', 'deadline', 'object', 'arg']
}

function USEC() {
	this.inPorts = ['usec'];
	this.outPorts = ['time'];
}
function MSEC() {
	this.inPorts = ['msec'];
	this.outPorts = ['time'];
}

function SEC() {
	this.inPorts = ['sec'];
	this.outPorts = ['time'];
}

function CURRENT_OFFSET() {
	this.outPorts = ['time'];
}

function SET() {
	this.inPorts = ['value'];
	this.outPorts = 'variable'];
}

function IF() {
	this.inPorts = ['condition'];
	this.outPorts = ['ifTrue', 'ifFalse']
}


