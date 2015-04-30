var moonWalkers = [
  "Neil Armstrong",
  "Buzz Aldrin",
  "Pete Conrad",
  "Alan Bean",
  "Alan Shepard",
  "Edgar Mitchell",
  "David Scott",
  "James Irwin",
  "John Young",
  "Charles Duke",
  "Eugene Cernan",
  "Harrison Schmitt"
];

/**
  * This function will take an array of two part names in "firstName lastName"
  *    format, modify them to the "lastName, firstName" format then alphabetically sort them.
  *    If the name contains a comma, it will assume the name is already
  *    in the required format.
  * @param {array} names - The list of two part names to be reformatted and sorted.
  * @return {array} - The alphabetically sorted list of names in "LastName, FirstName" format.
*/
function alphabetizer(names) {
  var i;

  // Iterate over the names array.
  for (i = 0; i < names.length; i++) {
    // Reformat the current name.
    names[i] = formatNameLastFirst(names[i]);
  }
  // Sort the array.
  names.sort();
  // Retrun the result.
  return names;
}

/**
  * This function will format a name so that it is last name first.
  *    If the name passed to this function contains a comma, the function will assume
  *    the name is already in the required format and return the original value.
  *
  * Note: This will not work on full names that contain more than two (2)
  *    name elements. (e.g. John Quincy Adams, Martin Van Buren)
  *    Unpredicatble results will occur because it cannot determine whether the
  *    additional name(s) should be part of the first, middle or last name.
  * @param {string} originalName - The name to be formatted.
  * @return {string} - The name in "lastName, firstName" format.
*/
function formatNameLastFirst(originalName) {
  // Check for a comma
  if (originalName.indexOf(',') === -1) {
    // No comma found. Reformat the current name.
    return originalName
      .split(' ') // Split the first and last name into an array using a space as the delimiter.
      .reverse() // Reverse the first and last name.
      .join(', '); // Rejoin the names, last name first, with a comma.
  } else {
    // Do not modify the name.
    return originalName;
  }
}

// Try logging your results to test your code!
console.log(alphabetizer(moonWalkers));
