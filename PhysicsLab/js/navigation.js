document.addEventListener("DOMContentLoaded", () => {

    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");
    const currentPage = document.getElementById("current-page");

    const pageNames = {
        home: "Início",
        circuits: "Circuitos elétricos",
        magnetism: "Magnetismo",
        induction: "Indução eletromagnética",
        calculator: "Calculadora",
        exercises: "Exercícios",
        theory: "Referencial teórico"
    };

    function navigateTo(pageId) {

        const targetPage = document.getElementById(pageId);

        if (!targetPage) return;

        pages.forEach(page => {
            page.classList.remove("active");
        });

        targetPage.classList.add("active");

        navItems.forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.page === pageId
            );
        });

        currentPage.textContent = pageNames[pageId] || "PHYSICS LAB";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    navItems.forEach(item => {

        item.addEventListener("click", () => {
            navigateTo(item.dataset.page);
        });

    });

    document.querySelectorAll("[data-go]").forEach(element => {

        element.addEventListener("click", () => {
            navigateTo(element.dataset.go);
        });

    });

});