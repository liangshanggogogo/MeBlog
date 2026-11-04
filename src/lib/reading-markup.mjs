// Make wide Markdown tables usable without widening the reading column.
export function readingMarkup() {
  return (tree) => {
    function walk(node) {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element', tagName: 'div',
            properties: { className: ['table-scroll'], tabindex: 0, role: 'region', 'aria-label': '可横向滚动的表格' },
            children: [child],
          };
        }
        return child;
      });
    }
    walk(tree);
  };
}
