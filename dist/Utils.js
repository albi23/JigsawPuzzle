export class Utils {
    static swap(from, to, array) {
        let temp = array[from];
        array[from] = array[to];
        array[to] = temp;
        return array;
    }
    static randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
//../../node_modules/tslib
// window.onload = function () {
//     const stack:HTMLElement[] = [];
//     const root : HTMLElement = <HTMLElement> document.getElementById('tes');
//     stack.push(root);
//     let created = createNewHTMLElement('div',["row"]);
//     stack.push(created);
//     /*let*/ created = createNewHTMLElement('div',["col"],"col-1");
//     stack.push(created);
//     /*let*/ created  = createNewHTMLElement('img',["rounded", "img-fluid", "flex-img-size", "bordered-img"],"img1","../assets/image1.jpeg");
//     stack.push(created);
//     // appendElementsToParent(created2,created3)
//     // appendElementsToParent(created,created2)
//     // appendElementsToParent(root,created)
//     while (stack.length > 1){
//         let child = <HTMLElement>stack.pop();
//         let parent = <HTMLElement>stack.pop();
//         stack.push(appendElementsToParent(parent,child))
//     }
// };
//
// function loadIMG(url: string, id: string): Promise<any> {
//
//     return new Promise<any>((resolve, reject) => {
//
//         const parent: HTMLDivElement = <HTMLDivElement>document.getElementById(id);
//         let newElement: HTMLImageElement = document.createElement('img');
//         newElement.setAttribute("src", url);
//         newElement.setAttribute("alt", url);
//         newElement.setAttribute("width", "30%");
//         newElement.setAttribute("height", "30%");
//         parent.appendChild(newElement);
//         newElement.onload = function () {
//             resolve(url);
//         };
//         newElement.onerror = function () {
//             reject(url);
//         };
//     });
// }
//
//
// function appendElementsToParent(parent: HTMLElement, child: HTMLElement):HTMLElement {
//     parent.appendChild(child);
//     return parent;
// }
//
// function createNewHTMLElement(newElementType: string, classNames?: string[], id?: string, url?:string): HTMLElement {
//     let newElement: HTMLElement = <HTMLElement>document.createElement(newElementType);
//     if (classNames) newElement = <HTMLElement>addClasses(newElement, classNames);
//     if (id) newElement = <HTMLElement>addId(newElement, id);
//     if (id) newElement = <HTMLElement>addSrc(newElement, url);
//     return newElement;
// }
//
// function addClasses(element: HTMLElement, classNames?: string[]): HTMLElement {
//     if (!element) return element;
//     if (classNames && classNames.length > 0) {
//         for (const newClass of classNames) {
//             element.classList.add(newClass)
//         }
//     }
//     return element;
// }
//
// function addId(element: HTMLElement,id: string): HTMLElement {
//     if (!element) return element;
//     element.setAttribute("id", id);
//     return element;
// }
//
// function addSrc(element: HTMLElement,url?: string): HTMLElement {
//     if (!element) return element;
//     if (typeof url === "string") {
//         element.setAttribute("src", url);
//     }
//     return element;
// }
//# sourceMappingURL=Utils.js.map