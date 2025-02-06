export function createElement(tag, textContent, parent, className) {
  const element = document.createElement(tag);
  if (textContent) element.textContent = textContent;
  if (className) element.className = className;
  parent.appendChild(element);
  return element;
}
