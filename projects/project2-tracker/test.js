// console.log("Hello from Node.js!");

// Try some basic JavaScript
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);

// // Calculate a sum
// let sum = numbers.reduce((acc, n) => acc + n, 0);
// console.log("Sum:", sum);

// Convert restaurant name to lowercase
let restaurantName = "Pizza FRIGGING Place";
let lowerName = restaurantName.toLowerCase();
 
console.log(lowerName);
// Prints: "pizza place"

// Step 1: Get the restaurant name
let restaurantName = "pizza place";
 
// Step 2: Convert to lowercase
let lowerName = restaurantName.toLowerCase();
 
// Step 3: Get search term (already lowercase)
let searchTerm = "pizza place";
 
// Step 4: Compare them
let matches = lowerName === searchTerm;
 
console.log(matches);
// Prints: true ✓