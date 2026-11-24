document.addEventListener("DOMContentLoaded", () => {

    const list = document.getElementById("theory-list");
    if (!list) return;

    const { escapeHTML } = window.PhysicsUtils;

    const searchInput = document.getElementById("theory-search");
    const filterButtons = document.querySelectorAll(".theory-filter");
    const emptyState = document.getElementById("theory-empty");
    const counter = document.getElementById("theory-count");

    const areas = {
        circuits: { label: "Circuitos", color: "blue", page: "circuits" },
        magnetism: { label: "Magnetismo", color: "purple", page: "magnetism" },
        induction: { label: "Indução", color: "orange", page: "induction" }
    };

    const topics = [
        {
            area: "circuits",
            title: "Corrente elétrica",
            summary: "Corrente é a quantidade de carga que atravessa uma seção do condutor por unidade de tempo. Por convenção, o sentido da corrente é o do movimento das cargas positivas, ou seja, do polo + para o polo − no circuito externo.",
            formulas: [
                { expr: "I = ΔQ / Δt", vars: "I: corrente (A) · ΔQ: carga (C) · Δt: tempo (s)" }
            ],
            tip: "1 A equivale a 1 coulomb por segundo, cerca de 6,24 × 10^18 elétrons por segundo."
        },
        {
            area: "circuits",
            title: "Lei de Ohm",
            summary: "Em condutores ôhmicos, a tensão aplicada é diretamente proporcional à corrente que os percorre. A constante de proporcionalidade é a resistência elétrica, que depende do material e da geometria do condutor.",
            formulas: [
                { expr: "U = R · I", vars: "U: tensão (V) · R: resistência (Ω) · I: corrente (A)" },
                { expr: "R = ρ · L / A", vars: "ρ: resistividade (Ω·m) · L: comprimento (m) · A: área da seção (m²)" }
            ],
            tip: "Dobrar o comprimento de um fio dobra sua resistência; dobrar a área da seção a reduz pela metade."
        },
        {
            area: "circuits",
            title: "Associação de resistores",
            summary: "Em série, todos os resistores são percorridos pela mesma corrente e a tensão se divide entre eles. Em paralelo, todos ficam submetidos à mesma tensão e a corrente se divide entre os ramos.",
            formulas: [
                { expr: "Req = R1 + R2 + … + Rn", vars: "Associação em série" },
                { expr: "1/Req = 1/R1 + 1/R2 + … + 1/Rn", vars: "Associação em paralelo" },
                { expr: "Req = R1·R2 / (R1 + R2)", vars: "Atalho para dois resistores em paralelo" }
            ],
            tip: "Em paralelo, a resistência equivalente é sempre menor que a menor das resistências."
        },
        {
            area: "circuits",
            title: "Potência e efeito Joule",
            summary: "A potência elétrica mede a taxa com que a energia é transferida. Em um resistor, essa energia é convertida em calor (efeito Joule).",
            formulas: [
                { expr: "P = U · I", vars: "P: potência (W)" },
                { expr: "P = R · I² = U² / R", vars: "Formas equivalentes usando a Lei de Ohm" },
                { expr: "E = P · Δt", vars: "E: energia (J) · Δt: tempo (s)" }
            ],
            tip: "1 kWh = 3,6 × 10^6 J, que é a unidade usada na conta de luz."
        },
        {
            area: "circuits",
            title: "Leis de Kirchhoff",
            summary: "A lei dos nós diz que a soma das correntes que chegam a um nó é igual à soma das que saem (conservação da carga). A lei das malhas diz que a soma das tensões ao percorrer uma malha fechada é zero (conservação da energia).",
            formulas: [
                { expr: "Σ I entrando = Σ I saindo", vars: "Lei dos nós" },
                { expr: "Σ U = 0", vars: "Lei das malhas" }
            ],
            tip: "Escolha um sentido para cada corrente; se o resultado der negativo, o sentido real é o oposto."
        },
        {
            area: "magnetism",
            title: "Campo magnético",
            summary: "O campo magnético B é produzido por ímãs e por cargas em movimento (correntes). Suas linhas saem do polo norte e entram no polo sul, sempre formando curvas fechadas: não existem monopolos magnéticos.",
            formulas: [
                { expr: "B = μ0 · I / (2π · d)", vars: "Fio retilíneo longo · d: distância ao fio (m)" },
                { expr: "B = μ0 · N · I / (2R)", vars: "Centro de uma espira circular de raio R" },
                { expr: "B = μ0 · (N / L) · I", vars: "Interior de um solenoide de comprimento L" }
            ],
            tip: "Regra da mão direita: o polegar aponta no sentido da corrente e os dedos curvados indicam o sentido das linhas de B."
        },
        {
            area: "magnetism",
            title: "Força magnética sobre cargas",
            summary: "Uma carga em movimento dentro de um campo magnético sofre uma força perpendicular tanto à velocidade quanto ao campo. Por isso a força magnética não realiza trabalho: altera a direção, mas não o módulo da velocidade.",
            formulas: [
                { expr: "F = |q| · v · B · sen(θ)", vars: "θ: ângulo entre v e B" },
                { expr: "F⃗ = q · (v⃗ × B⃗)", vars: "Forma vetorial (produto vetorial)" }
            ],
            tip: "Para θ = 0° ou 180° (v paralela a B), a força é nula e a partícula segue em linha reta."
        },
        {
            area: "magnetism",
            title: "Movimento circular em campo uniforme",
            summary: "Quando a velocidade é perpendicular a B, a força magnética atua como resultante centrípeta e a partícula descreve um movimento circular uniforme. Para ângulos intermediários, a trajetória é uma hélice.",
            formulas: [
                { expr: "r = m · v / (|q| · B)", vars: "r: raio da trajetória (m)" },
                { expr: "T = 2π · m / (|q| · B)", vars: "Período: não depende da velocidade" }
            ],
            tip: "Esse é o princípio do espectrômetro de massa e do cíclotron."
        },
        {
            area: "magnetism",
            title: "Força sobre um condutor",
            summary: "Um fio percorrido por corrente dentro de um campo magnético sofre força, pois a corrente é um conjunto de cargas em movimento. É o princípio de funcionamento dos motores elétricos.",
            formulas: [
                { expr: "F = B · I · L · sen(θ)", vars: "L: comprimento do fio no campo (m) · θ: ângulo entre o fio e B" },
                { expr: "F/L = μ0 · I1 · I2 / (2π · d)", vars: "Força entre dois fios paralelos" }
            ],
            tip: "Fios com correntes no mesmo sentido se atraem; com correntes em sentidos opostos, se repelem."
        },
        {
            area: "induction",
            title: "Fluxo magnético",
            summary: "O fluxo magnético mede quantas linhas de campo atravessam uma superfície. Depende da intensidade do campo, da área e da orientação da superfície em relação ao campo.",
            formulas: [
                { expr: "Φ = B · A · cos(θ)", vars: "Φ: fluxo (Wb) · θ: ângulo entre B e a normal à superfície" }
            ],
            tip: "1 Wb = 1 T·m². O fluxo é máximo quando B é perpendicular à superfície (θ = 0°)."
        },
        {
            area: "induction",
            title: "Lei de Faraday",
            summary: "Toda variação de fluxo magnético através de um circuito induz nele uma força eletromotriz. A variação pode vir de mudanças em B, na área ou no ângulo.",
            formulas: [
                { expr: "ε = −N · ΔΦ / Δt", vars: "ε: FEM induzida (V) · N: número de espiras" },
                { expr: "I = ε / R", vars: "Corrente induzida em um circuito de resistência R" }
            ],
            tip: "Um fluxo constante, por mais intenso que seja, não induz FEM alguma."
        },
        {
            area: "induction",
            title: "Lei de Lenz",
            summary: "O sentido da corrente induzida é tal que o campo magnético criado por ela se opõe à variação de fluxo que a originou. É o sinal negativo na Lei de Faraday e uma consequência da conservação da energia.",
            formulas: [
                { expr: "ε = −dΦ/dt", vars: "O sinal negativo expressa a oposição à variação" }
            ],
            tip: "Ao aproximar um ímã de uma espira, a corrente induzida cria um polo de mesmo nome, que repele o ímã."
        },
        {
            area: "induction",
            title: "FEM de movimento",
            summary: "Uma barra condutora que se move dentro de um campo magnético tem suas cargas separadas pela força magnética, surgindo uma diferença de potencial entre suas extremidades.",
            formulas: [
                { expr: "ε = B · L · v", vars: "L: comprimento da barra (m) · v: velocidade (m/s)" }
            ],
            tip: "Geradores e dínamos convertem energia mecânica em elétrica a partir desse princípio."
        },
        {
            area: "induction",
            title: "Transformadores",
            summary: "Um transformador usa a indução mútua entre duas bobinas enroladas em um mesmo núcleo para elevar ou reduzir tensões alternadas. Só funciona com corrente alternada, que produz fluxo variável.",
            formulas: [
                { expr: "U1 / U2 = N1 / N2", vars: "Relação de tensões e número de espiras" },
                { expr: "U1 · I1 = U2 · I2", vars: "Transformador ideal: a potência se conserva" }
            ],
            tip: "Linhas de transmissão usam tensões altas para reduzir a corrente e, com isso, as perdas por efeito Joule."
        }
    ];

    let activeFilter = "all";

    function normalize(text) {
        return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function render() {
        const query = normalize(searchInput.value);

        const visible = topics.filter(topic => {
            const matchesArea = activeFilter === "all" || topic.area === activeFilter;
            const haystack = normalize([
                topic.title,
                topic.summary,
                topic.tip,
                ...topic.formulas.map(f => `${f.expr} ${f.vars}`)
            ].join(" "));
            return matchesArea && haystack.includes(query);
        });

        list.innerHTML = visible.map(topic => {
            const area = areas[topic.area];
            return `
                <article class="theory-topic">
                    <div class="theory-topic-header">
                        <span class="theory-area ${area.color}">${area.label}</span>
                        <button class="theory-link" data-go="${area.page}">Abrir simulador →</button>
                    </div>
                    <h4>${escapeHTML(topic.title)}</h4>
                    <p>${escapeHTML(topic.summary)}</p>
                    <div class="theory-formulas">
                        ${topic.formulas.map(f => `
                            <div class="theory-formula">
                                <span class="formula">${escapeHTML(f.expr)}</span>
                                <small>${escapeHTML(f.vars)}</small>
                            </div>
                        `).join("")}
                    </div>
                    <div class="theory-tip"><strong>Dica:</strong> ${escapeHTML(topic.tip)}</div>
                </article>
            `;
        }).join("");

        emptyState.hidden = visible.length > 0;
        counter.textContent = `${visible.length} ${visible.length === 1 ? "tópico" : "tópicos"}`;
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;
            filterButtons.forEach(b => b.classList.toggle("active", b === button));
            render();
        });
    });

    searchInput.addEventListener("input", render);

    render();
});
