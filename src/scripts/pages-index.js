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

                const categoryGroup = document.createElement("div");
                categoryGroup.classList.add("category-group");

                categoryGroup.appendChild(
                    createHeading(category, "category-heading")
                );

                // Спільна обгортка для всіх class-group
                const classGroupsWrapper = document.createElement("div");
                classGroupsWrapper.classList.add("class-groups");

                Object.keys(grouped[category])
                    .sort((a, b) => a.localeCompare(b, "uk"))
                    .forEach(itemClass => {

                        const classGroupWrapper = document.createElement("div");
                        classGroupWrapper.classList.add("class-group");

                        classGroupWrapper.appendChild(
                            createHeading(itemClass, "class-heading")
                        );

                        const classGroup = grouped[category][itemClass];

                        if (classGroup._items) {
                            appendItems(classGroupWrapper, classGroup._items);
                        }

                        Object.keys(classGroup)
                            .filter(key => key !== "_items")
                            .sort((a, b) => a.localeCompare(b, "uk"))
                            .forEach(type => {

                                const typeGroup = document.createElement("div");
                                typeGroup.classList.add("type-group");

                                typeGroup.appendChild(
                                    createHeading(type, "type-heading")
                                );

                                appendItems(typeGroup, classGroup[type]);

                                classGroupWrapper.appendChild(typeGroup);
                            });

                        // class-group додаємо не в category-group,
                        // а в спільний class-groups
                        classGroupsWrapper.appendChild(classGroupWrapper);
                    });

                categoryGroup.appendChild(classGroupsWrapper);

                list.appendChild(categoryGroup);
            });

    } catch (e) {
        list.innerHTML = "<div><em>Не вдалося завантажити список сторінок</em></div>";
        console.error(e);
    }
})();

function createHeading(text, className) {
    const el = document.createElement("div");
    el.classList.add(className);
    el.textContent = text + ":";

    return el;
}

function appendItems(container, items) {
    items
        .sort((a, b) => a.name.localeCompare(b.name, "uk"))
        .forEach(page => {
            const el = document.createElement("div");
            const a = document.createElement("a");
            const img = document.createElement("img");

            const imgName = page.url.replace(".html", ".webp");

            img.src = `../images/items/${imgName}`;
            img.classList.add("squared", "glow");

            a.href = `/pages/${page.url}`;
            a.textContent = page.name;

            el.classList.add('item')
            el.appendChild(img);
            el.appendChild(a);

            container.appendChild(el);
        });
}
