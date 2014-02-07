
	function rakeForApplicationObject() {
		var application = {};
		// Kickoff
		var kickoff = $('.KickoffForm').first();
		application.kickoff = getKickoffFromListItem(kickoff);
		
		// Include
		application.includes = $('.IncludeForm ul.include-list li').map(getIncludeFromListItem);

		// StateMachines
		application.stateMachines = 
			$('.StateMachineForm .state-machine-list .state-machine-list-item')
				.map(getStateMachineFromListItem);
		
		// Variables
		application.variables = 
			$('.GlobalVariableForm .global-variable-list .variable-list-item')
				.map(getVariableFromListItem);
		
		// Methods
		application.methods = 
			$('.MethodForm .method-list .method-list-item')
				.map(getMethodFromListItem);
		
		// Functions
		application.functions = 
			$('.FunctionForm .function-list .function-list-item')
				.map(getFunctionFromListItem);
		// Interrupts
		application.interrupts = 
			$('.InterruptForm .interrupt-list .interrupt-list-item')
				.map(getInterruptFromListItem);
		
		createApplicationC(application);
		return application;
	}


function getTimeScopeFromListItem() {}
function RTTimeScope (minDelay, maxDelay, deadline, maximumElapsedTime) {
	this.minDelay = minDelay || 0;
	this.maxDelay = maxDelay || 0;
	this.deadline = deadline || 0;
	this.maximumElapsedTime = maximumElapsedTime || 0;
}

function getIncludeFromListItem(index, item) {
	var value = $(this).children('li .includeValue').first().text();
	return new RTInclude(value);
}
function RTInclude(includefile) {
	this.value = includefile;
}

function getStateMachineFromListItem(index, item) {
	var name = $(this).find('.stateMachineName').text();
	var variables = $(this).find('li.variable-list-item').map(getVariableFromListItem);
	return new RTStateMachine(name, variables);
}
function RTStateMachine(name, variables) {
	this.name = name;
	this.variables = variables;
}

function getVariableFromListItem(index, item) {
	var type = $(item).children('a.variableType').first().text();
	var name = $(item).children('a.variableName').first().text();
	var value = $(item).children('a.variableValue').first().text();
	return new RTVariable(name, type, value);
}
function RTVariable(name, type, value)  {
	this.type = type || '';
	this.name = name;
	this.value = value || '';
}

function getMethodFromListItem(index, item) {
	var type = $(item).children('.methodType').first().text();
	var name = $(item).children('.methodName').first().text();
	var object = $(item).children('.methodObject').first().text();
	var variable = $(item).children('.methodInputArgument').first().text();
	var body = $(item).children('.methodBody').first().text();
	return new RTMethod(type, name, object, variable, body);
}
function RTMethod(type, name, object, variable, body, timeScope) {
	this.type = type;
	this.name = name;
	this.object = object;
	this.variable = variable;
	this.body = body;
	this.timeScope = timeScope;
}

function getFunctionFromListItem(index, item) {
	var type = $(item).children('.functionType').first().text();
	var name = $(item).children('.functionName').first().text();
	var args = $(item).children('.functionArgs').first().text();
	var body = $(item).children('.functionBody').first().text();
	return new RTFunction(type, name, args, body);
}
function RTFunction(type, name, args, body, timeScope) {
	this.type = type;
	this.name = name;
	this.args = args;
	this.body = body;
	this.timeScope = timeScope;
}

function getInterruptFromListItem(index, item) {
	var object = $(this).children('.interruptObject').first().text();
	var method = $(this).children('.interruptMethod').first().text();
	var interrupt = $(this).children('.interruptInterrupt').first().text();
	return new RTInterrupt(object, method, interrupt);
}
function RTInterrupt(object, method, interrupt) {
	this.object = object;
	this.method = method;
	this.interrupt = interrupt;
}

function getKickoffFromListItem(item) {
	var mainobj = $(item).children('.kickoffMainobj').text();
	var mainarg = $(item).children('.kickoffMainarg').text();
	var object = $(item).children('.kickoffObject').text();
	var variable = $(item).children('.kickoffVariable').text();
	var body = $(item).children('.kickoffBody').text();
	return new RTKickoff(object, variable, mainobj,mainarg, body);
}
function RTKickoff(object, variable, mainobj, mainarg, body) {
	this.object = object;
	this.variable = variable;
	this.mainobj = mainobj;
	this.mainarg = mainarg;
	this.body = body;
}

function RTBody(calls) {
	this.calls = calls || [];
}
// RTCALL is One Line Of Code.
function RTCall(call) {
	this.call = call;
}

application = {
	includes: [ 
		new RTInclude('"TinyTimber.h"'),
		new RTInclude('"sciTinyTimber.h"'),
		new RTInclude('"canTinyTimber.h"'),
		new RTInclude('<machine/hcs12/pim.h>'),
   	],

   stateMachines: [
      new RTStateMachine('App',
      [
         new RTVariable('super', 'Object', 'initObject()'),
         new RTVariable('count', 'int', '0'),
         new RTVariable('c', 'char', 'X'),
      ]),
   ], 

	variables: [
		new RTVariable('p', 'PPIM', '0x240'),
		new RTVariable('index', 'int', '0'),
		new RTVariable('mySum', 'int', '0'),
		new RTVariable('input[32]', 'char', '""'),
		new RTVariable('output[64]', 'char', '""'),
		new RTVariable('min_index', 'int', '-10'),
		new RTVariable('max_index', 'int', '14'),
		new RTVariable('brotherJohn[32]', 'int', '{ 0,2,4,0,0,2,4,0,4,5,7,4,5,7,7,9,7,5,4,0,7,9,7,5,4,0,0,-5,0,0,-5,0 }'),
		new RTVariable('periods[25]', 'int', '{ 2024,1911,1803,1702,1607,1516,1431,1351,1275,1203,1136,1072,1012,955,901,851,803,758,715,675,637,601,568,536,506  }'),
		new RTVariable('app', 'App', '{ initObject(), 0, \'X\'}'),
		new RTVariable('sci0', 'Serial', 'initSerial(SCI_PRO0, &app, reader)'),
		new RTVariable('can0', 'Can', 'initCan(CAN0BASE, &app, receiver)'),
		new RTVariable('blr', 'int', '100'),
	], 

	methods: [
		new RTMethod('void', 'loadLoop', 'App', 'int x', 'for(x = 0; x < blr; x++) {} \n' +
			'AFTER(USEC(1300),self, loadLoop,0);\n'),
		new RTMethod('void', 'tone', 'App', 'int x', 'if (x == 0) { \n' +
			'x = 1;\n' +
			'p->ptp = 1;\n' +
			'} else {\n' + 
			'x = 0;\n' +
			'p->ptp = 0;\n' +
			'}\n' +
			'AFTER(USEC(500), self, tone, x);'),
		new RTMethod('void', 'receiver', 'App', 'int unused', 'CANMsg msg;\n'+
			'CAN_RECEIVE(&can0, &msg);\n' +
			'SCI_WRITE(&sci0, "Can msg received: ");\n'+
			'SCI_WRITE(&sci0, msg.buff);\n'),
		new RTMethod('void', 'reader', 'App', 'int unused', 'SCI_WRITE(&sci0, "Rcv: \'");\n' + 
			'SCI_WRITECHAR(&sci0, c);\n' + 
			'SCI_WRITE(&sci0, "\'\n");\n' +
			'parseInt(c);\n'),
	],

	functions: [
		new RTFunction('void', 'printPeriod', 'int key', 'int i = 0;\n' + 
			'if(key > 5) key = 5;\n' +
			'if(key < -5) key = -5;\n' + 
			'for(i;i<32; i++) {\n' +
			'int y = brotherJohn[i] + 10 + key;\n' + 
			'sprintf(output, "%d\n", periods[y]);\n' +
			'SCI_WRITE(&sci0, output);\n' + 
			'}\n'),
		new RTFunction('void', 'parseInt', 'int d', 'input[index] = 0;\n' +
			'mySum = atoi(input);\n'+
			'blr = mySum;\n'+
			'input[index] = \'\\n\';\n'+
			'SCI_WRITE(&sci0, "The entered number is ");\n'+
			'SCI_WRITE(&sci0, input);\n'+
			'printPeriod(mySum);\n'+
			'index = 0;\n'+
			'return;\n')
	],

	interrupts: [
		new RTInterrupt('sci0', 'sci_interrupt', 'SCI_IRQ0' ),
		new RTInterrupt('can0', 'can_interrupt', 'CAN_IRQ0' ),
	],
	kickoff: new RTKickoff(
		'App', 'int arg',
		'app', '0',
		'CANMsg msg;\n' +
		'SCI_INIT(&sci0);\n' + 
		'CAN_INIT(&can0);\n' +
		'SCI_WRITE(&sci0, "Hello, hello...\n");\n' + 
		'msg.msgId = 1;\n' + 
		'msg.nodeId = 1;\n'+ 
		'msg.length = 6;\n'+ 
		'msg.buff[0] = \'H\';\n' +
		'msg.buff[1] = \'e\';\n' +
		'msg.buff[2] = \'l\';\n' +
		'msg.buff[3] = \'l\';\n' + 
		'msg.buff[4] = \'o\';\n' + 
		'msg.buff[5] = 0;\n' +
		'CAN_SEND(&can0, &msg);\n' +
		'p->ddrp = 0x1;\n' +
		'ASYNC(self,tone, 0);\n' +
		'ASYNC(self,loadLoop, 0);'
	),
};