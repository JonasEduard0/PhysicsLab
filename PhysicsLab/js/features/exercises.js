/* =========================================
   PHYSICS LAB - EXERCÍCIOS
   Questões numéricas geradas aleatoriamente
   e questões conceituais com correção.
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const card = document.getElementById("exercise-card");
    if (!card) return;

    const { constants, formatNumber, parseNumber, randomInt, pick, shuffle, storage, escapeHTML } = window.PhysicsUtils;

    const topicButtons = document.querySelectorAll(".exercise-topic");
    const tagEl = document.getElementById("exercise-tag");
    const typeEl = document.getElementById("exercise-type");
    const statementEl = document.getElementById("exercise-statement");
    const answerArea = document.getElementById("exercise-answer");
    const feedbackEl = document.getElementById("exercise-feedback");
    const checkButton = document.getElementById("exercise-check");
    const nextButton = document.getElementById("exercise-next");
    const hintButton = document.getElementById("exercise-hint");
    const hintBox = document.getElementById("exercise-hint-box");

    const statCorrect = document.getElementById("stat-correct");
    const statTotal = document.getElementById("stat-total");
    const statAccuracy = document.getElementById("stat-accuracy");
    const statStreak = document.getElementById("stat-streak");
    const statBest = document.getElementById("stat-best");
    const topicStatsEl = document.getElementById("exercise-topic-stats");
    const resetStatsButton = document.getElementById("exercise-reset-stats");

    const topicNames = {
        circuits: "Circuitos",
        magnetism: "Magnetismo",
        induction: "Indução"
    };

    const fmt = (value, decimals = 2) => formatNumber(Number(value.toFixed(decimals)), decimals);

    /* ---------- Questões numéricas (geradas) ---------- */

    const generators = [
        {
            topic: "circuits",
            build() {
                const U = pick([6, 9, 12, 24]);
                const R1 = randomInt(2, 20) * 5;
                const R2 = randomInt(2, 20) * 5;
                const Req = R1 + R2;
                const I = U / Req * 1000;
                return {
                    statement: `Uma bateria de <b>${U} V</b> alimenta dois resistores em série, R1 = <b>${R1} Ω</b> e R2 = <b>${R2} Ω</b>. Qual a corrente no circuito?`,
                    unit: "mA",
                    answer: I,
                    hint: "Em série, some as resistências e aplique a Lei de Ohm.",
                    solution: [
                        `Req = R1 + R2 = ${R1} + ${R2} = ${Req} Ω`,
                        `I = U / Req = ${U} / ${Req} = ${fmt(I / 1000, 4)} A`,
                        `I ≈ <b>${fmt(I)} mA</b>`
                    ]
                };
            }
        },
        {
            topic: "circuits",
            build() {
                const R1 = pick([10, 20, 30, 40, 60, 80, 120]);
                const R2 = pick([10, 20, 30, 40, 60, 80, 120]);
                const Req = R1 * R2 / (R1 + R2);
                return {
                    statement: `Dois resistores, de <b>${R1} Ω</b> e <b>${R2} Ω</b>, estão associados em paralelo. Qual a resistência equivalente?`,
                    unit: "Ω",
                    answer: Req,
                    hint: "Para dois resistores em paralelo: Req = R1·R2 / (R1 + R2).",
                    solution: [
                        `Req = R1·R2 / (R1 + R2)`,
                        `Req = ${R1}·${R2} / (${R1} + ${R2}) = ${R1 * R2} / ${R1 + R2}`,
                        `Req ≈ <b>${fmt(Req)} Ω</b>`
                    ]
                };
            }
        },
        {
            topic: "circuits",
            build() {
                const U = pick([110, 127, 220]);
                const P = pick([60, 100, 500, 1000, 1500, 2200, 4400]);
                const R = U ** 2 / P;
                return {
                    statement: `Um aparelho tem especificação <b>${P} W – ${U} V</b>. Qual a resistência do aparelho em funcionamento normal?`,
                    unit: "Ω",
                    answer: R,
                    hint: "Use P = U² / R e isole R.",
                    solution: [
                        `P = U² / R  ⇒  R = U² / P`,
                        `R = ${U}² / ${P} = ${U ** 2} / ${P}`,
                        `R ≈ <b>${fmt(R)} Ω</b>`
                    ]
                };
            }
        },
        {
            topic: "circuits",
            build() {
                const P = pick([800, 1200, 2000, 4500, 5500]);
                const h = pick([0.25, 0.5, 1, 2, 3]);
                const days = 30;
                const kWh = P / 1000 * h * days;
                return {
                    statement: `Um chuveiro de <b>${P} W</b> é usado <b>${formatNumber(h)} h</b> por dia. Quanta energia ele consome em ${days} dias?`,
                    unit: "kWh",
                    answer: kWh,
                    hint: "E = P · Δt. Converta a potência para kW e o tempo para horas.",
                    solution: [
                        `P = ${P} W = ${formatNumber(P / 1000)} kW`,
                        `Δt = ${formatNumber(h)} h/dia × ${days} dias = ${formatNumber(h * days)} h`,
                        `E = ${formatNumber(P / 1000)} × ${formatNumber(h * days)} = <b>${fmt(kWh)} kWh</b>`
                    ]
                };
            }
        },
        {
            topic: "magnetism",
            build() {
                const q = randomInt(1, 9);
                const v = randomInt(2, 20) * 100;
                const B = pick([0.1, 0.2, 0.25, 0.5, 0.8, 1, 1.5]);
                const theta = pick([30, 45, 60, 90]);
                const F = q * 1e-6 * v * B * Math.sin(theta * Math.PI / 180) * 1000;
                return {
                    statement: `Uma carga de <b>${q} µC</b> se move a <b>${v} m/s</b> em um campo magnético de <b>${formatNumber(B)} T</b>, formando <b>${theta}°</b> com o campo. Qual o módulo da força magnética?`,
                    unit: "mN",
                    answer: F,
                    hint: "F = |q| · v · B · sen θ. Lembre que 1 µC = 10⁻⁶ C.",
                    solution: [
                        `F = |q| · v · B · sen θ`,
                        `F = ${q}×10⁻⁶ × ${v} × ${formatNumber(B)} × sen ${theta}°`,
                        `F ≈ ${fmt(F / 1000, 6)} N = <b>${fmt(F)} mN</b>`
                    ]
                };
            }
        },
        {
            topic: "magnetism",
            build() {
                const I = randomInt(1, 20);
                const dcm = pick([1, 2, 4, 5, 10, 20]);
                const B = constants.mu0 * I / (2 * Math.PI * dcm / 100) * 1e6;
                return {
                    statement: `Um fio retilíneo e longo é percorrido por uma corrente de <b>${I} A</b>. Qual a intensidade do campo magnético a <b>${dcm} cm</b> do fio? (μ0 = 4π × 10⁻⁷ T·m/A)`,
                    unit: "µT",
                    answer: B,
                    hint: "B = μ0 · I / (2π · d). Converta a distância para metros.",
                    solution: [
                        `B = μ0 · I / (2π · d) = (2 × 10⁻⁷) · I / d`,
                        `B = 2×10⁻⁷ × ${I} / ${formatNumber(dcm / 100)}`,
                        `B ≈ ${fmt(B / 1e6, 8)} T = <b>${fmt(B)} µT</b>`
                    ]
                };
            }
        },
        {
            topic: "magnetism",
            build() {
                const v = randomInt(1, 9) * 1e5;
                const B = pick([0.01, 0.02, 0.05, 0.1]);
                const m = 1.67e-27;
                const q = constants.e;
                const r = m * v / (q * B) * 100;
                return {
                    statement: `Um próton (m = 1,67 × 10⁻²⁷ kg, q = 1,6 × 10⁻¹⁹ C) entra perpendicularmente em um campo de <b>${formatNumber(B)} T</b> com velocidade <b>${formatNumber(v / 1e5)} × 10⁵ m/s</b>. Qual o raio da trajetória?`,
                    unit: "cm",
                    answer: r,
                    hint: "Com v ⟂ B, a força magnética é a resultante centrípeta: r = m·v / (|q|·B).",
                    solution: [
                        `r = m · v / (|q| · B)`,
                        `r = 1,67×10⁻²⁷ × ${formatNumber(v / 1e5)}×10⁵ / (1,6×10⁻¹⁹ × ${formatNumber(B)})`,
                        `r ≈ ${fmt(r / 100, 4)} m = <b>${fmt(r)} cm</b>`
                    ],
                    tolerance: 0.03
                };
            }
        },
        {
            topic: "magnetism",
            build() {
                const B = pick([0.2, 0.4, 0.5, 0.8, 1.2]);
                const I = randomInt(2, 15);
                const L = pick([0.1, 0.2, 0.3, 0.5]);
                const F = B * I * L;
                return {
                    statement: `Um fio de <b>${formatNumber(L * 100)} cm</b>, percorrido por <b>${I} A</b>, está perpendicular a um campo de <b>${formatNumber(B)} T</b>. Qual a força magnética no fio?`,
                    unit: "N",
                    answer: F,
                    hint: "F = B · I · L · sen θ, com θ = 90°.",
                    solution: [
                        `F = B · I · L · sen 90°`,
                        `F = ${formatNumber(B)} × ${I} × ${formatNumber(L)} × 1`,
                        `F = <b>${fmt(F, 3)} N</b>`
                    ]
                };
            }
        },
        {
            topic: "induction",
            build() {
                const B = pick([0.2, 0.4, 0.5, 0.8, 1]);
                const Acm = pick([50, 100, 200, 400]);
                const theta = pick([0, 30, 45, 60]);
                const Phi = B * Acm / 1e4 * Math.cos(theta * Math.PI / 180) * 1000;
                return {
                    statement: `Uma espira de área <b>${Acm} cm²</b> está em um campo de <b>${formatNumber(B)} T</b>. O ângulo entre o campo e a normal à espira é <b>${theta}°</b>. Qual o fluxo magnético?`,
                    unit: "mWb",
                    answer: Phi,
                    hint: "Φ = B · A · cos θ. Lembre: 1 cm² = 10⁻⁴ m².",
                    solution: [
                        `A = ${Acm} cm² = ${formatNumber(Acm / 1e4)} m²`,
                        `Φ = ${formatNumber(B)} × ${formatNumber(Acm / 1e4)} × cos ${theta}°`,
                        `Φ ≈ ${fmt(Phi / 1000, 6)} Wb = <b>${fmt(Phi, 3)} mWb</b>`
                    ]
                };
            }
        },
        {
            topic: "induction",
            build() {
                const N = pick([10, 20, 50, 100, 200]);
                const Phi1 = pick([0, 2, 4, 5]);
                const Phi2 = Phi1 + pick([2, 4, 6, 8, 10]);
                const dt = pick([0.1, 0.2, 0.5, 1]);
                const emf = N * (Phi2 - Phi1) / 1000 / dt;
                return {
                    statement: `O fluxo em uma bobina de <b>${N} espiras</b> varia de <b>${Phi1} mWb</b> para <b>${Phi2} mWb</b> em <b>${formatNumber(dt)} s</b>. Qual o módulo da FEM induzida?`,
                    unit: "V",
                    answer: emf,
                    hint: "|ε| = N · |ΔΦ| / Δt. Converta mWb para Wb.",
                    solution: [
                        `ΔΦ = ${Phi2} − ${Phi1} = ${Phi2 - Phi1} mWb = ${formatNumber((Phi2 - Phi1) / 1000)} Wb`,
                        `|ε| = ${N} × ${formatNumber((Phi2 - Phi1) / 1000)} / ${formatNumber(dt)}`,
                        `|ε| = <b>${fmt(emf, 3)} V</b>`
                    ]
                };
            }
        },
        {
            topic: "induction",
            build() {
                const B = pick([0.2, 0.3, 0.5, 0.8]);
                const L = pick([0.2, 0.4, 0.5, 1]);
                const v = randomInt(2, 15);
                const R = pick([2, 4, 5, 10]);
                const emf = B * L * v;
                const I = emf / R;
                return {
                    statement: `Uma barra de <b>${formatNumber(L * 100)} cm</b> desliza a <b>${v} m/s</b> sobre trilhos, perpendicular a um campo de <b>${formatNumber(B)} T</b>. O circuito tem resistência de <b>${R} Ω</b>. Qual a corrente induzida?`,
                    unit: "A",
                    answer: I,
                    hint: "Primeiro calcule ε = B · L · v; depois aplique I = ε / R.",
                    solution: [
                        `ε = B · L · v = ${formatNumber(B)} × ${formatNumber(L)} × ${v} = ${fmt(emf, 3)} V`,
                        `I = ε / R = ${fmt(emf, 3)} / ${R}`,
                        `I = <b>${fmt(I, 3)} A</b>`
                    ]
                };
            }
        },
        {
            topic: "induction",
            build() {
                const U1 = pick([110, 127, 220]);
                const N1 = pick([500, 1000, 1100, 2200]);
                const U2 = pick([6, 9, 12, 24]);
                const N2 = N1 * U2 / U1;
                return {
                    statement: `Um transformador ideal reduz <b>${U1} V</b> para <b>${U2} V</b>. Se o primário tem <b>${N1} espiras</b>, quantas espiras tem o secundário?`,
                    unit: "espiras",
                    answer: N2,
                    hint: "U1 / U2 = N1 / N2.",
                    solution: [
                        `N2 = N1 · U2 / U1`,
                        `N2 = ${N1} × ${U2} / ${U1}`,
                        `N2 ≈ <b>${fmt(N2, 1)} espiras</b>`
                    ]
                };
            }
        }
    ];

    /* ---------- Questões conceituais ---------- */

    const conceptual = [
        {
            topic: "circuits",
            statement: "Ao adicionar mais um resistor em paralelo a um circuito alimentado por uma fonte ideal, a corrente total fornecida pela fonte:",
            options: ["Aumenta", "Diminui", "Permanece igual", "Se anula"],
            correct: 0,
            explanation: "Cada resistor a mais em paralelo diminui a resistência equivalente. Com a mesma tensão, a corrente total I = U / Req aumenta."
        },
        {
            topic: "circuits",
            statement: "Em uma associação em série, qual grandeza é a mesma para todos os resistores?",
            options: ["Tensão", "Potência", "Corrente", "Resistência"],
            correct: 2,
            explanation: "Em série há um único caminho para as cargas, então a corrente é a mesma em todos os resistores. A tensão se divide entre eles."
        },
        {
            topic: "circuits",
            statement: "Duas lâmpadas de 60 W e 100 W (ambas para 220 V) são ligadas em série a 220 V. Qual brilha mais?",
            options: ["A de 100 W", "A de 60 W", "Brilham igualmente", "Nenhuma acende"],
            correct: 1,
            explanation: "A lâmpada de 60 W tem maior resistência (R = U²/P). Em série a corrente é a mesma, então dissipa mais quem tem maior R (P = R·I²): a de 60 W."
        },
        {
            topic: "magnetism",
            statement: "Uma partícula carregada entra em um campo magnético uniforme com velocidade paralela às linhas de campo. O que acontece?",
            options: ["Descreve um círculo", "Segue em linha reta", "Para", "Descreve uma hélice"],
            correct: 1,
            explanation: "Com θ = 0°, sen θ = 0 e a força magnética é nula. A partícula mantém a velocidade e segue em linha reta."
        },
        {
            topic: "magnetism",
            statement: "Por que a força magnética não altera a energia cinética de uma carga?",
            options: [
                "Porque é sempre muito pequena",
                "Porque é sempre perpendicular à velocidade",
                "Porque só atua em cargas paradas",
                "Porque se anula com a força elétrica"
            ],
            correct: 1,
            explanation: "A força magnética é perpendicular à velocidade, então não realiza trabalho. Ela muda a direção do movimento, mas não o módulo da velocidade."
        },
        {
            topic: "magnetism",
            statement: "Dois fios paralelos conduzem correntes no mesmo sentido. Os fios:",
            options: ["Se atraem", "Se repelem", "Não interagem", "Giram"],
            correct: 0,
            explanation: "Cada fio cria um campo que exerce força sobre o outro. Para correntes no mesmo sentido, pela regra da mão direita, a força é de atração."
        },
        {
            topic: "magnetism",
            statement: "Se a velocidade de uma partícula em MCU dentro de um campo magnético dobrar, o raio da trajetória:",
            options: ["Dobra", "Cai pela metade", "Quadruplica", "Não muda"],
            correct: 0,
            explanation: "r = m·v / (|q|·B) é diretamente proporcional a v. Dobrando v, o raio dobra (o período, porém, não muda)."
        },
        {
            topic: "induction",
            statement: "Um ímã está parado dentro de uma bobina ligada a um amperímetro. O amperímetro indica:",
            options: ["Corrente máxima", "Corrente alternada", "Corrente nula", "Corrente constante não nula"],
            correct: 2,
            explanation: "Sem movimento, o fluxo magnético não varia. Pela Lei de Faraday, sem variação de fluxo não há FEM induzida, e portanto não há corrente."
        },
        {
            topic: "induction",
            statement: "O sinal negativo na Lei de Faraday (ε = −N·ΔΦ/Δt) representa:",
            options: [
                "Que a FEM é sempre negativa",
                "A Lei de Lenz: a corrente induzida se opõe à variação de fluxo",
                "Que o fluxo diminui com o tempo",
                "A perda de energia por calor"
            ],
            correct: 1,
            explanation: "É a Lei de Lenz: o campo da corrente induzida se opõe à variação de fluxo que a gerou, o que garante a conservação da energia."
        },
        {
            topic: "induction",
            statement: "Por que transformadores não funcionam com corrente contínua constante?",
            options: [
                "Porque esquentam demais",
                "Porque o fluxo no núcleo não varia",
                "Porque a tensão é muito baixa",
                "Porque o núcleo perde a magnetização"
            ],
            correct: 1,
            explanation: "Com corrente contínua constante, o fluxo no núcleo é constante. Sem variação de fluxo, não há FEM induzida no secundário."
        },
        {
            topic: "induction",
            statement: "Uma espira gira em um campo uniforme. Em qual posição o fluxo através dela é máximo?",
            options: [
                "Plano da espira paralelo a B",
                "Plano da espira perpendicular a B",
                "Plano a 45° de B",
                "O fluxo é sempre o mesmo"
            ],
            correct: 1,
            explanation: "Φ = B·A·cos θ, com θ medido entre B e a normal. O plano perpendicular a B significa normal paralela a B (θ = 0°), o que dá fluxo máximo."
        }
    ];

    /* ---------- Estado e estatísticas ---------- */

    const statsStore = storage("physicslab.exercises.stats", null);
    const emptyStats = () => ({
        correct: 0,
        total: 0,
        streak: 0,
        best: 0,
        byTopic: {
            circuits: { correct: 0, total: 0 },
            magnetism: { correct: 0, total: 0 },
            induction: { correct: 0, total: 0 }
        }
    });

    let stats = statsStore.load() || emptyStats();
    let activeTopic = "all";
    let question = null;
    let answered = false;
    let lastKey = "";

    function updateStats() {
        statCorrect.textContent = stats.correct;
        statTotal.textContent = stats.total;
        statAccuracy.textContent = stats.total ? `${Math.round(stats.correct / stats.total * 100)}%` : "—";
        statStreak.textContent = stats.streak;
        statBest.textContent = stats.best;

        topicStatsEl.innerHTML = Object.entries(stats.byTopic).map(([topic, s]) => {
            const pct = s.total ? Math.round(s.correct / s.total * 100) : 0;
            return `
                <div class="topic-stat">
                    <div class="topic-stat-head">
                        <span>${topicNames[topic]}</span>
                        <strong>${s.correct}/${s.total}</strong>
                    </div>
                    <div class="topic-stat-bar"><i class="${topic}" style="width:${pct}%"></i></div>
                </div>
            `;
        }).join("");
    }

    /* ---------- Fluxo da questão ---------- */

    function newQuestion() {
        const numeric = generators.filter(g => activeTopic === "all" || g.topic === activeTopic);
        const concepts = conceptual.filter(c => activeTopic === "all" || c.topic === activeTopic);

        let candidate;
        let key;
        let attempts = 0;

        // Evita repetir a mesma questão conceitual em sequência
        do {
            if (Math.random() < 0.6) {
                const gen = pick(numeric);
                candidate = { kind: "numeric", topic: gen.topic, ...gen.build() };
                key = "";
            } else {
                const item = pick(concepts);
                const order = shuffle(item.options.map((_, i) => i));
                candidate = {
                    kind: "choice",
                    ...item,
                    options: order.map(i => item.options[i]),
                    correct: order.indexOf(item.correct)
                };
                key = item.statement;
            }
            attempts++;
        } while (key && key === lastKey && attempts < 5);

        lastKey = key;
        question = candidate;
        answered = false;
        renderQuestion();
    }

    function renderQuestion() {
        tagEl.textContent = topicNames[question.topic];
        tagEl.className = `theory-area ${{ circuits: "blue", magnetism: "purple", induction: "orange" }[question.topic]}`;
        typeEl.textContent = question.kind === "numeric" ? "Questão numérica" : "Questão conceitual";
        statementEl.innerHTML = question.statement;
        feedbackEl.hidden = true;
        feedbackEl.className = "exercise-feedback";
        hintBox.hidden = true;
        hintButton.hidden = question.kind !== "numeric";
        checkButton.hidden = false;
        checkButton.disabled = false;

        if (question.kind === "numeric") {
            hintBox.textContent = question.hint;
            answerArea.innerHTML = `
                <label class="exercise-input">
                    <span>Sua resposta</span>
                    <div class="calc-input-row">
                        <input type="text" inputmode="decimal" id="exercise-value" placeholder="Ex.: 12,5" autocomplete="off">
                        <span class="calc-unit">${question.unit}</span>
                    </div>
                </label>
            `;
            const input = document.getElementById("exercise-value");
            input.addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    answered ? newQuestion() : checkAnswer();
                }
            });
            input.focus({ preventScroll: true });
        } else {
            answerArea.innerHTML = `
                <div class="exercise-options">
                    ${question.options.map((opt, i) => `
                        <button class="exercise-option" data-option="${i}">
                            <span>${String.fromCharCode(65 + i)}</span>${escapeHTML(opt)}
                        </button>
                    `).join("")}
                </div>
            `;
        }
    }

    function register(isCorrect) {
        stats.total++;
        stats.byTopic[question.topic].total++;

        if (isCorrect) {
            stats.correct++;
            stats.byTopic[question.topic].correct++;
            stats.streak++;
            stats.best = Math.max(stats.best, stats.streak);
        } else {
            stats.streak = 0;
        }

        statsStore.save(stats);
        updateStats();
    }

    function showFeedback(isCorrect, bodyHTML) {
        feedbackEl.hidden = false;
        feedbackEl.classList.add(isCorrect ? "correct" : "wrong");
        feedbackEl.innerHTML = `
            <strong>${isCorrect ? "✓ Resposta correta!" : "✗ Não foi dessa vez."}</strong>
            ${bodyHTML}
        `;
        checkButton.hidden = true;
        hintButton.hidden = true;
        answered = true;
    }

    function checkAnswer() {
        if (answered || !question) return;

        if (question.kind === "numeric") {
            const input = document.getElementById("exercise-value");
            const value = parseNumber(input.value);

            if (Number.isNaN(value)) {
                input.classList.add("invalid");
                input.focus();
                return;
            }

            input.classList.remove("invalid");
            input.disabled = true;

            const tolerance = question.tolerance ?? 0.02;
            const isCorrect = Math.abs(value - question.answer) <= Math.abs(question.answer) * tolerance + 1e-9;

            register(isCorrect);
            showFeedback(isCorrect, `
                <p>Resposta esperada: <b>${fmt(question.answer, 3)} ${question.unit}</b> (tolerância de ±${Math.round(tolerance * 100)}%).</p>
                <ol class="exercise-solution">${question.solution.map(step => `<li>${step}</li>`).join("")}</ol>
            `);
        }
    }

    answerArea.addEventListener("click", event => {
        const option = event.target.closest("[data-option]");
        if (!option || answered || question.kind !== "choice") return;

        const chosen = Number(option.dataset.option);
        const isCorrect = chosen === question.correct;

        answerArea.querySelectorAll(".exercise-option").forEach((button, i) => {
            button.disabled = true;
            if (i === question.correct) button.classList.add("correct");
            if (i === chosen && !isCorrect) button.classList.add("wrong");
        });

        register(isCorrect);
        showFeedback(isCorrect, `<p>${escapeHTML(question.explanation)}</p>`);
    });

    checkButton.addEventListener("click", checkAnswer);
    nextButton.addEventListener("click", newQuestion);
    hintButton.addEventListener("click", () => {
        hintBox.hidden = !hintBox.hidden;
    });

    topicButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeTopic = button.dataset.topic;
            topicButtons.forEach(b => b.classList.toggle("active", b === button));
            newQuestion();
        });
    });

    resetStatsButton.addEventListener("click", () => {
        if (resetStatsButton.dataset.confirm !== "1") {
            resetStatsButton.dataset.confirm = "1";
            resetStatsButton.textContent = "Clique de novo para confirmar";
            setTimeout(() => {
                resetStatsButton.dataset.confirm = "";
                resetStatsButton.textContent = "↻ Zerar estatísticas";
            }, 3000);
            return;
        }
        resetStatsButton.dataset.confirm = "";
        resetStatsButton.textContent = "↻ Zerar estatísticas";
        stats = emptyStats();
        statsStore.save(stats);
        updateStats();
    });

    updateStats();
    newQuestion();
});
