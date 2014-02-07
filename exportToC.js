

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
      var output = 'typedef struct {\n';
      if(sm.variables) {
         var n2 = sm.variables.length;
         for (var j = 0; j < n2; j++) {
            var v = sm.variables[j];
            output += v.type + ' ' + v.name + ';\n';
         };
      }
      constructor += ' };\n'
      output += '} ' + sm.name + ';\n';
      outputStrings.push(output);
   }
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
      output += ';\n';
      outputStrings.push(output);
   }; 
   return outputStrings;
}



function createMethodStubs(methods, functions) {
   var outputStrings = [];
   var n = methods.length;
   for (var i = 0; i < n; i++) {
      var m = methods[i];
      var output = m.type + ' ' + m.name + '(' + m.object + '*self, ' + m.variable +');\n';
      outputStrings.push(output);
   };
   n = functions.length;
   for (var i = 0; i < n; i++) {
      var f = functions[i];
      var output = f.type + ' ' + f.name + '(' + f.arg + ');\n'
      outputStrings.push(output);
   };
   return outputStrings;
}



function createMethods(methods) {
   var outputStrings = [];
   var n = methods.length;
   for (var i = 0; i < n; i++) {
      var m = methods[i];
      var output = m.type + ' ' + m.name + '(' + m.object + '*self, ' + m.variable + ') {\n' +
         m.body + 
      '}\n';
      outputStrings.push(output);
   };
   return outputStrings;
}



function createFunctions (functions) {
   var outputStrings = [];
   var n = functions.length;
   for (var i = 0; i < n; i++) {
      var f = functions[i];
      var output = f.type + ' ' + f.name + '(' + f.arg + ') {\n' +
         f.body +
      '}\n';
      outputStrings.push(output);
   };
   return outputStrings;
}



function createKickoff(kickoff) {
   console.log(kickoff);
   var output = 
   'void kickoff(' + kickoff.object + ',' + kickoff.variable + ') {\n' +
      kickoff.body +
   '\n}\n';
   return output;
}

function createMain(interrupts, kickoff) {
   var outputStrings = [];
   outputStrings.push('int main() {\n');
   var n = interrupts.length;
   for (var i = 0; i < n; i++) {
      var irq = interrupts[i];
      var output = 'INSTALL(&' + irq.object + ', ' + irq.method + ', ' + irq.interrupt + ');\n';
      outputStrings.push(output);
   };
   outputStrings.push('return TINYTIMBER(&'+kickoff.mainobj+', kickoff, '+kickoff.mainarg+');\n');
   outputStrings.push('}\n')
   return outputStrings;
}

function createApplicationC(application) {
   var strings = [];
   
   console.log('CREATING INCLUDE');
   strings.push(createIncludePart(application.includes).join(''));

   console.log('CREATING KICKOFF');
   strings.push(createKickoff(application.kickoff));

   console.log('CREATING GLOBALS');
   strings.push(createGlobals(application.variables).join(''));

   console.log('CREATING METHOD STUBS');
   strings.push(createMethodStubs(application.methods, application.functions).join(''));

   console.log('CREATING FUNCTIONS');
   strings.push(createFunctions(application.functions).join(''));

   console.log('CREATING METHODS');
   var m = createMethods(application.methods).join('\n');
   strings.push(m);

   console.log('CREATING STATE MACHINES');
   var s = createStateMachines(application.stateMachines);
   console.log('DONE CREATING STATE MACHINES');
   strings.push(s);

   console.log('CREATING MAIN');
   strings.push(createMain(application.interrupts, application.kickoff).join(''));

   console.log('FINISHING TOUCHES');
   var finalFile = strings.join('');

   console.log(finalFile);
   console.log('DONE');
   $('#output').empty().text(finalFile);
}