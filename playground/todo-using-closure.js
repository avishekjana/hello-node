function todoList() {
  all = []
  function add(item) {
    all.push(item)
    console.log(all)
  }
  function update(index, updatedItem) {
    all[index] = updatedItem
    console.log(all)
  }
  return { all, add, update };
};

const todos = todoList();
console.log(typeof(todos)); // function
console.log(todos.all)
todos.add('Avishek'); 
console.log(todos.all)
todos.update(0, 'Avishek 2'); 
console.log(todos.all)
