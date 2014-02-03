

function createIncludePart(includes) {
   var outputStrings = [];
   var n = includes.length;
   for (var i = 0; i < n; i++) {
      var inc = includes[i];
      var output = '#include ' + inc.value + '\n';
      outputStrings.push(output);
   };
   return outputStrings;
}


function createStateMachines(stateMachines) {
   var outputStrings = [];
   var n = stateMachines.length;
   for (var i = 0; i < n; i++) {
      var sm = stateMachines[i];
      var output = 'typedef struct {';
      for (var i = sm.variables.length - 1; i >= 0; i--) {
         var v = sm.variables[i];
         output += v.type + ' ' + v.name + ';';
      };
      output += '} ' + sm.name + ';';
      outputStrings.push(output);
   };
   return outputStrings;
   
}

function createGlobals(variables) {
   var outputStrings = [];
   var n = variables.length;
   for (var i = 0; i < n; i++) {
      var v = variables[i];
      var output = v.type + ' ' + v.name;
      if(v.value) {
         output = output + ' = ' + v.value;
      }
      output += ';';
      outputStrings.push(output);
   }; 
   return outputStrings;
}



function createMethodStubs(methods, functions) {
   var outputStrings = [];
   var n = methods.length;
   for (var i = 0; i < n; i++) {
      var m = methods[i];
      var output = m.type + ' ' + m.name + '(' + m.object + '*self, ' + m.variable +');';
      outputStrings.push(output);
   };
   n = functions.length;
   for (var i = 0; i < n; i++) {
      var f = functions[i];
      var output = f.type + ' ' + f.name + '(' + f.arg + ');'
      outputStrings.push(output);
   };
   return outputStrings;
}



function createMethods(methods) {
   var outputStrings = [];
   var n = methods.length;
   for (var i = 0; i < n; i++) {
      var m = methods[i];
      var output = m.type + ' ' + m.name + '(' + m.object + '*self, ' + m.variable + ') {' +
         m.body + 
      '}';
      outputStrings.push(output);
   };
   return outputStrings;
}



function createFunctions (functions) {
   var outputStrings = [];
   var n = functions.length;
   for (var i = 0; i < n; i++) {
      var f = functions[i];
      var output = f.type + ' ' + f.name + '(' + f.arg + ') {' +
         f.body +
      '}';
      outputStrings.push(output);
   };
   return outputStrings;
}



function createKickoff(kickoff) {
   var output = 
   'void kickoff(' + kickoff.object + ',' + kickoff.variable + ') {' +
      kickoff.body +
   '}';
   return output;
}

function createMain(interrupts, kickoff) {
   var outputStrings = [];
   outputStrings.push('int main() {');
   var n = interrupts.length;
   for (var i = 0; i < n; i++) {
      var irq = interrupts[i];
      var output = 'INSTALL(&' + irq.object + ', ' + irq.method + ', ' + irq.interrupt + ');\n';
      outputStrings.push(output);
   };
   outputStrings.push('return TINYTIMBER(&'+kickoff.mainobj+', kickoff, '+kickoff.mainarg+');');
   return outputStrings;
}

function createApplicationC(application) {
   var strings = [];
   alert('lol!');
   //strings.push(createMain(application.interrupts, application.kickoff));
   //strings.push(createKickoff(application.kickoff));
   //strings.push(createGlobals(application.variables));
   //strings.push(createFunctions(application.functions));
   //strings.push(createMethods(application.methods));
   //strings.push(createMethodStubs(application.methods, application.functions));
   //strings.push(createStateMachines(application.stateMachines));
   strings.push(createIncludePart(application.includes));

   var finalFile = strings;

   console.log(finalFile);

   $('#output').text (finalFile);
}