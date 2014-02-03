

function TimeScope (minDelay, maxDelay, deadline, maximumElapsedTime) {
	this.minDelay = minDelay || 0;
	this.maxDelay = maxDelay || 0;
	this.deadline = deadline || 0;
	this.maximumElapsedTime = maximumElapsedTime || 0;
}

function Include(includefile) {
	this.value = includefile;
}

function StateMachine(name, variables) {
	this.name = name;
	this.variables = variables;
}

function Variable(name, type, value)  {
	this.type = type || '';
	this.name = name;
	this.value = value || '';
}

function Method(type, name, object, variable, body, timeScope) {
	this.type = type;
	this.name = name;
	this.object = object;
	this.variable = variable;
	this.body = body;
	this.timeScope = timeScope;
}

function Function(type, name, arg, body, timeScope) {
	this.type = type;
	this.name = name;
	this.arg = arg;
	this.body = body;
	this.timeScope = timeScope;
}

function Interrupt(object, method, interrupt) {
	this.object = object;
	this.method = method;
	this.interrupt = interrupt;
}

function Kickoff(object, variable, mainobj, mainarg, body) {
	this.object = object;
	this.variable = variable;
	this.mainobj = mainobj;
	this.mainarg = mainarg;
	this.body = body;
}

application = {
	includes: [ 
		new Include('"TinyTimber.h"'),
		new Include('"sciTinyTimber.h"'),
		new Include('"canTinyTimber.h"'),
		new Include('<machine/hcs12/pim.h>'),
   	],

   stateMachines: [
      new StateMachine('App',
      [
         new Variable('super', 'Object', 'initObject()'),
         new Variable('count', 'int', '0'),
         new Variable('c', 'char', 'X'),
      ]),
   ], 

	variables: [
		new Variable('p', 'PPIM', '0x240'),
		new Variable('index', 'int', '0'),
		new Variable('mySum', 'int', '0'),
		new Variable('input[32]', 'char', '""'),
		new Variable('output[64]', 'char', '""'),
		new Variable('min_index', 'int', '-10'),
		new Variable('max_index', 'int', '14'),
		new Variable('brotherJohn[32]', 'int', '{ 0,2,4,0,0,2,4,0,4,5,7,4,5,7,7,9,7,5,4,0,7,9,7,5,4,0,0,-5,0,0,-5,0 }'),
		new Variable('periods[25]', 'int', '{ 2024,1911,1803,1702,1607,1516,1431,1351,1275,1203,1136,1072,1012,955,901,851,803,758,715,675,637,601,568,536,506  }'),
		new Variable('app', 'App', '{ initObject(), 0, \'X\'}'),
		new Variable('sci0', 'Serial', 'initSerial(SCI_PRO0, &app, reader)'),
		new Variable('can0', 'Can', 'initCan(CAN0BASE, &app, receiver)'),
		new Variable('blr', 'int', '100'),
	], 

	   methods: [
	   		new Method('void', 'loadLoop', 'App', 'int x', 'for(x = 0; x < blr; x++) {} AFTER(USEC(1300),self, loadLoop,0);'),
	   		new Method('void', 'tone', 'App', 'int x', 'if (x == 0) { \nx = 1;\np->ptp = 1;\n} else {\nx = 0;p->ptp = 0;\n}\nAFTER(USEC(500), self, tone, x);'),
	      	new Method('void', 'receiver', 'App', 'int unused', 'CANMsg msg;'+
	         'CAN_RECEIVE(&can0, &msg);' +
	         'SCI_WRITE(&sci0, "Can msg received: ");'+
	         'SCI_WRITE(&sci0, msg.buff);'),
	      	new Method('void', 'reader', 'App', 'int unused', 'SCI_WRITE(&sci0, "Rcv: \'");' + 
	         'SCI_WRITECHAR(&sci0, c);' + 
	         'SCI_WRITE(&sci0, "\'\n");' +
	         'parseInt(c);'),
	   ],

	   functions: [
	   		new Function('void', 'printPeriod', 'int key', 'int i = 0;' + 
	      'if(key > 5) key = 5;' +
	      'if(key < -5) key = -5;' + 
	      'for(i;i<32; i++) {' +
	         'int y = brotherJohn[i] + 10 + key;' + 
	         'sprintf(output, "%d\n", periods[y]);' +
	      	'SCI_WRITE(&sci0, output);' + 
	      '}'),
	      new Function('void', 'parseInt', 'int d', 'input[index] = 0; ' +
	         'mySum = atoi(input);'+
	         'blr = mySum;'+
	         'input[index] = \'\\n\';'+
	         'SCI_WRITE(&sci0, "The entered number is ");'+
	         'SCI_WRITE(&sci0, input);'+
	         'printPeriod(mySum);'+
	         'index = 0;'+
	         'return;')
	   ],

	   interrupts: [
	      new Interrupt('sci0', 'sci_interrupt', 'SCI_IRQ0' ),
	      new Interrupt('can0', 'can_interrupt', 'CAN_IRQ0' ),
	   ],
	   kickoff: new Kickoff(
	      'App', 'int arg',
	      'app', '0',
	      'CANMsg msg;' +
	         'SCI_INIT(&sci0);' + 
	         'CAN_INIT(&can0);' +
	         'SCI_WRITE(&sci0, "Hello, hello...\n");' + 
	         'msg.msgId = 1;' + 
	         'msg.nodeId = 1;'+ 
	         'msg.length = 6;'+ 
	         'msg.buff[0] = \'H\';' +
	         'msg.buff[1] = \'e\';' +
	         'msg.buff[2] = \'l\';' +
	         'msg.buff[3] = \'l\';' + 
	         'msg.buff[4] = \'o\';' + 
	         'msg.buff[5] = 0;' +
	         'CAN_SEND(&can0, &msg);' +
	         'p->ddrp = 0x1;' +
	         'ASYNC(self,tone, 0);' +
	         'ASYNC(self,loadLoop, 0);'
	   ),
	};