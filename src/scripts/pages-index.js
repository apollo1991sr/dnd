// (async function () {
//     const list = document.getElementById("pages-list");
//     if (!list) return;
//
//     try {
//         const res = await fetch("/__pages.json");
//         const pages = await res.json();
//
//         list.innerHTML = "";
//
//         pages.forEach(file => {
//             const name = file.replace(/\.html$/i, "");
//
//             const li = document.createElement("li");
//             const a = document.createElement("a");
//
//             a.href = `/pages/${file}`;
//             a.textContent = name.replace(/-/g, " ");
//
//             li.appendChild(a);
//             list.appendChild(li);
//         });
//
//     } catch (e) {
//         list.innerHTML = "<li><em>Не вдалося завантажити список сторінок</em></li>";
//     }
// })();

(async function () {
    const list = document.getElementById("pages-list");
    if (!list) return;

    try {
        const res = await fetch("/data/pages.json");

        if (!res.ok) {
            throw new Error("Не вдалося завантажити pages.json");
        }

        const pages = await res.json();

        list.innerHTML = "";

        const sortedPages = pages.sort((a, b) => {
            return a.name.localeCompare(b.name, "uk");
        });

        const grouped = {};

        sortedPages.forEach(page => {
            const category = page.category || "Без категорії";
            const itemClass = page.class || "Інше";
            const type = page.type || null;

            if (!grouped[category]) {
                grouped[category] = {};
            }

            if (!grouped[category][itemClass]) {
                grouped[category][itemClass] = {};
            }

            if (type) {
                if (!grouped[category][itemClass][type]) {
                    grouped[category][itemClass][type] = [];
                }

                grouped[category][itemClass][type].push(page);
            } else {
                if (!grouped[category][itemClass]._items) {
                    grouped[category][itemClass]._items = [];
                }

                grouped[category][itemClass]._items.push(page);
            }
        });

        Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b, "uk"))
            .forEach(category => {
                list.appendChild(createHeading(category, "category-heading"));

                Object.keys(grouped[category])
                    .sort((a, b) => a.localeCompare(b, "uk"))
                    .forEach(itemClass => {
                        list.appendChild(createHeading(itemClass, "class-heading"));

                        const classGroup = grouped[category][itemClass];

                        if (classGroup._items) {
                            appendItems(list, classGroup._items);
                        }

                        Object.keys(classGroup)
                            .filter(key => key !== "_items")
                            .sort((a, b) => a.localeCompare(b, "uk"))
                            .forEach(type => {
                                list.appendChild(createHeading(type, "type-heading"));
                                appendItems(list, classGroup[type]);
                            });
                    });
            });

    } catch (e) {
        list.innerHTML = "<li><em>Не вдалося завантажити список сторінок</em></li>";
        console.error(e);
    }
})();

function createHeading(text, className) {
    const li = document.createElement("li");
    li.classList.add(className);
    li.textContent = text + ":";

    return li;
}

function appendItems(list, items) {
    items
        .sort((a, b) => a.name.localeCompare(b.name, "uk"))
        .forEach(page => {
            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = `/pages/${page.url}`;
            a.textContent = page.name;

            li.appendChild(a);
            list.appendChild(li);
        });
}
