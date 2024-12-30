class NavigationSite {
    constructor() {
        this.init();
        this.currentCategory = null;
        this.currentSubmenu = null;
    }

    init() {
        this.renderNavigation();
        if (navData.categories.length > 0) {
            const firstCategory = navData.categories[0];
            this.renderContent(firstCategory.id);
            document.getElementById('categoryTitle').textContent = firstCategory.name;
        }
    }

    renderNavigation() {
        const navItems = document.querySelector('.nav-items');
        navItems.innerHTML = '';

        navData.categories.forEach((category, index) => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'nav-category';
            if (category.children) {
                categoryElement.classList.add('has-children');
            }
            if (index === 0) categoryElement.classList.add('active');

            // 渲染主菜单
            categoryElement.innerHTML = `
                <h3>
                    <i class="iconfont ${category.icon}"></i>
                    <span>${category.name}</span>
                </h3>
                ${this.renderSubmenu(category)}
            `;

            // 处理点击事件
            const h3Element = categoryElement.querySelector('h3');
            h3Element.addEventListener('click', (e) => {
                if (category.children) {
                    // 如果有子菜单，切换展开状态
                    categoryElement.classList.toggle('expanded');
                } else {
                    // 如果没有子菜单，激活当前菜单
                    this.activateCategory(categoryElement, category);
                }
            });

            // 为子菜单项添加点击事件
            if (category.children) {
                const submenuItems = categoryElement.querySelectorAll('.submenu-item');
                submenuItems.forEach((item, subIndex) => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const subCategory = category.children[subIndex];
                        this.activateSubmenu(item, subCategory);
                    });
                });
            }

            navItems.appendChild(categoryElement);
        });
    }

    renderSubmenu(category) {
        if (!category.children) return '';

        const submenuItems = category.children.map(subCategory => `
            <div class="submenu-item" data-id="${subCategory.id}">
                ${subCategory.name}
            </div>
        `).join('');

        return `<div class="submenu">${submenuItems}</div>`;
    }

    activateCategory(element, category) {
        // 移除所有激活状态
        document.querySelectorAll('.nav-category').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.submenu-item').forEach(el => {
            el.classList.remove('active');
        });

        element.classList.add('active');
        
        // 更新标题和内容
        document.getElementById('categoryTitle').textContent = category.name;
        this.renderContent(category.id);
    }

    activateSubmenu(element, subCategory) {
        // 移除所有子菜单的激活状态
        document.querySelectorAll('.submenu-item').forEach(el => {
            el.classList.remove('active');
        });
        element.classList.add('active');

        // 更新标题和内容
        document.getElementById('categoryTitle').textContent = subCategory.name;
        this.renderContent(subCategory.id);
    }

    renderContent(categoryId) {
        const contentGrid = document.getElementById('contentGrid');
        contentGrid.innerHTML = '';
        
        // 查找一级分类
        let categoryData = navData.categories.find(cat => cat.id === categoryId);
        
        // 如果没有找到一级分类，尝试在二级分类中查找
        if (!categoryData || !categoryData.items) {
            for (const category of navData.categories) {
                if (category.children) {
                    const subCategory = category.children.find(sub => sub.id === categoryId);
                    if (subCategory) {
                        categoryData = subCategory;
                        break;
                    }
                }
            }
        }

        // 如果找到了分类且有items，则渲染内容
        if (categoryData && categoryData.items) {
            categoryData.items.forEach(item => {
                const card = this.createCard(item);
                contentGrid.appendChild(card);
            });
        }
    }

    createCard(item) {
        const card = document.createElement('div');
        card.className = 'card';
        
        // 使用新的卡片结构
        card.innerHTML = `
            <div class="card-icon">
                <img src="images/logo/${item.icon}" alt="${item.name}">
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
        `;

        // 添加点击事件
        card.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(item.url, '_blank');
        });

        // 添加hover效果的类
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
        });

        return card;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NavigationSite();
}); 