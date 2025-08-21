export async function fetchReadme() {
  return fetch('/client/README.xml')
      .then(response => response.text());
}