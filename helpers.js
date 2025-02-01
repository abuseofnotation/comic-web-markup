export const createElement =
  (type, namespace = "http://www.w3.org/2000/svg") =>
  ({ className, text, onClick, disabled, ...props }, children) => {
    //For HTML
    // const div = document.createElement(type);
    // For SVG
    const el = document.createElementNS(namespace, type)
    if (className) {
      div.classList.add(className);
    }
    if (text) {
      let textNode = document.createTextNode(text);
      el.appendChild(textNode);
    }
    if (children) {
      el.replaceChildren(...children.filter((c) => c !== undefined));
    }
    if (onClick) {
      el.addEventListener("click", onClick);
    }
    if (disabled) {
      el.setAttribute("disabled", true);
    }
    Object.keys(props).forEach((propName) => {
      el.setAttribute(propName, props[propName]);
    });
    return el;
  };

export const max = (list) => 
  list.reduce((max, int) => int > max ? int : max, 0)

