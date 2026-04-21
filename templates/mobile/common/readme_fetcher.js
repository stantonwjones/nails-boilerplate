export async function fetchReadme() {
  return fetch('/public/README.xml')
      .then(response => response.text());
}