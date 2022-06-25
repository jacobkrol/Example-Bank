function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const overwriteShadow = (
  parentElement: string,
  targetElement: string,
  callback: (value: any) => void
) => {
  const parents: NodeListOf<Element> = document.querySelectorAll(parentElement);
  const shadows: ShadowRoot[] = Array.from(parents)
    .map((x) => x.shadowRoot)
    .filter(nonNullable);
  const targets: ChildNode[] = shadows
    .map((x) => Array.from(x!.childNodes))
    .flat()
    .filter((x) => x.nodeName === targetElement.toLocaleUpperCase());

  targets.forEach(callback);
};
