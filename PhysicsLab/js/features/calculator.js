document.addEventListener("DOMContentLoaded", () => {

    const formulaList = document.getElementById("calc-formulas");
    if (!formulaList) return;

    const { constants, prefixes, formatSI, formatNumber, parseNumber, storage, escapeHTML } = window.PhysicsUtils;

    const targetContainer = document.getElementById("calc-targets");
    const inputsContainer = document.getElementById("calc-inputs");
    const formulaTitle = document.getElementById("calc-formula-title");
    const formulaExpr = document.getElementById("calc-formula-expr");
    const resultValue = document.getElementById("calc-result-value");
    const resultLabel = document.getElementById("calc-result-label");
    const stepsBox = document.getElementById("calc-steps");
    const historyList = document.getElementById("calc-history");
    const clearHistoryButton = document.getElementById("calc-clear-history");

    const deg = Math.PI / 180;
    const sin = a => Math.sin(a * deg);
    const cos = a => Math.cos(a * deg);
    const { mu0 } = constants;

    const formulas = [
        {
            id: "ohm",
            area: "Circuitos",
            name: "Lei de Ohm",
            expr: "U = R · I",
            vars: {
                U: { label: "Tensão", unit: "V" },
                R: { label: "Resistência", unit: "Ω" },
                I: { label: "Corrente", unit: "A" }
            },
            solve: {
                U: v => ({ value: v.R * v.I, expr: "U = R · I" }),
                R: v => ({ value: v.U / v.I, expr: "R = U / I" }),
                I: v => ({ value: v.U / v.R, expr: "I = U / R" })
            }
        },
        {
            id: "power",
            area: "Circuitos",
            name: "Potência elétrica",
            expr: "P = U · I",
            vars: {
                P: { label: "Potência", unit: "W" },
                U: { label: "Tensão", unit: "V" },
                I: { label: "Corrente", unit: "A" }
            },
            solve: {
                P: v => ({ value: v.U * v.I, expr: "P = U · I" }),
                U: v => ({ value: v.P / v.I, expr: "U = P / I" }),
                I: v => ({ value: v.P / v.U, expr: "I = P / U" })
            }
        },
        {
            id: "joule",
            area: "Circuitos",
            name: "Efeito Joule",
            expr: "P = R · I²",
            vars: {
                P: { label: "Potência", unit: "W" },
                R: { label: "Resistência", unit: "Ω" },
                I: { label: "Corrente", unit: "A" }
            },
            solve: {
                P: v => ({ value: v.R * v.I ** 2, expr: "P = R · I²" }),
                R: v => ({ value: v.P / v.I ** 2, expr: "R = P / I²" }),
                I: v => ({ value: Math.sqrt(v.P / v.R), expr: "I = √(P / R)" })
            }
        },
        {
            id: "parallel",
            area: "Circuitos",
            name: "Dois resistores em paralelo",
            expr: "Req = R1·R2 / (R1 + R2)",
            vars: {
                Req: { label: "Resistência equivalente", unit: "Ω" },
                R1: { label: "Resistência R1", unit: "Ω" },
                R2: { label: "Resistência R2", unit: "Ω" }
            },
            solve: {
                Req: v => ({ value: v.R1 * v.R2 / (v.R1 + v.R2), expr: "Req = R1·R2 / (R1 + R2)" }),
                R1: v => ({ value: v.Req * v.R2 / (v.R2 - v.Req), expr: "R1 = Req·R2 / (R2 − Req)" }),
                R2: v => ({ value: v.Req * v.R1 / (v.R1 - v.Req), expr: "R2 = Req·R1 / (R1 − Req)" })
            }
        },
        {
            id: "magforce",
            area: "Magnetismo",
            name: "Força magnética sobre carga",
            expr: "F = |q| · v · B · sen(θ)",
            vars: {
                F: { label: "Força", unit: "N" },
                q: { label: "Carga", unit: "C" },
                v: { label: "Velocidade", unit: "m/s" },
                B: { label: "Campo magnético", unit: "T" },
                theta: { label: "Ângulo θ", unit: "°", angle: true }
            },
            solve: {
                F: v => ({ value: Math.abs(v.q) * v.v * v.B * sin(v.theta), expr: "F = |q| · v · B · sen(θ)" }),
                q: v => ({ value: v.F / (v.v * v.B * sin(v.theta)), expr: "|q| = F / (v · B · sen θ)" }),
                v: v => ({ value: v.F / (Math.abs(v.q) * v.B * sin(v.theta)), expr: "v = F / (|q| · B · sen θ)" }),
                B: v => ({ value: v.F / (Math.abs(v.q) * v.v * sin(v.theta)), expr: "B = F / (|q| · v · sen θ)" }),
                theta: v => {
                    const ratio = v.F / (Math.abs(v.q) * v.v * v.B);
                    if (ratio > 1) return { error: "Sem solução: F é maior que |q|·v·B (sen θ > 1)." };
                    return { value: Math.asin(ratio) / deg, expr: "θ = arcsen(F / (|q| · v · B))", note: "O ângulo suplementar (180° − θ) também é solução." };
                }
            }
        },
        {
            id: "radius",
            area: "Magnetismo",
            name: "Raio da trajetória circular",
            expr: "r = m · v / (|q| · B)",
            vars: {
                r: { label: "Raio", unit: "m" },
                m: { label: "Massa", unit: "kg", noPrefix: true },
                v: { label: "Velocidade", unit: "m/s" },
                q: { label: "Carga", unit: "C" },
                B: { label: "Campo magnético", unit: "T" }
            },
            solve: {
                r: v => ({ value: v.m * v.v / (Math.abs(v.q) * v.B), expr: "r = m · v / (|q| · B)" }),
                m: v => ({ value: v.r * Math.abs(v.q) * v.B / v.v, expr: "m = r · |q| · B / v" }),
                v: v => ({ value: v.r * Math.abs(v.q) * v.B / v.m, expr: "v = r · |q| · B / m" }),
                q: v => ({ value: v.m * v.v / (v.r * v.B), expr: "|q| = m · v / (r · B)" }),
                B: v => ({ value: v.m * v.v / (Math.abs(v.q) * v.r), expr: "B = m · v / (|q| · r)" })
            }
        },
        {
            id: "wire",
            area: "Magnetismo",
            name: "Campo de um fio retilíneo",
            expr: "B = μ0 · I / (2π · d)",
            vars: {
                B: { label: "Campo magnético", unit: "T" },
                I: { label: "Corrente", unit: "A" },
                d: { label: "Distância ao fio", unit: "m" }
            },
            solve: {
                B: v => ({ value: mu0 * v.I / (2 * Math.PI * v.d), expr: "B = μ0 · I / (2π · d)" }),
                I: v => ({ value: v.B * 2 * Math.PI * v.d / mu0, expr: "I = 2π · d · B / μ0" }),
                d: v => ({ value: mu0 * v.I / (2 * Math.PI * v.B), expr: "d = μ0 · I / (2π · B)" })
            }
        },
        {
            id: "solenoid",
            area: "Magnetismo",
            name: "Campo de um solenoide",
            expr: "B = μ0 · (N / L) · I",
            vars: {
                B: { label: "Campo magnético", unit: "T" },
                N: { label: "Número de espiras", unit: "espiras", noPrefix: true },
                L: { label: "Comprimento", unit: "m" },
                I: { label: "Corrente", unit: "A" }
            },
            solve: {
                B: v => ({ value: mu0 * v.N / v.L * v.I, expr: "B = μ0 · (N / L) · I" }),
                N: v => ({ value: v.B * v.L / (mu0 * v.I), expr: "N = B · L / (μ0 · I)" }),
                L: v => ({ value: mu0 * v.N * v.I / v.B, expr: "L = μ0 · N · I / B" }),
                I: v => ({ value: v.B * v.L / (mu0 * v.N), expr: "I = B · L / (μ0 · N)" })
            }
        },
        {
            id: "wireforce",
            area: "Magnetismo",
            name: "Força sobre um condutor",
            expr: "F = B · I · L · sen(θ)",
            vars: {
                F: { label: "Força", unit: "N" },
                B: { label: "Campo magnético", unit: "T" },
                I: { label: "Corrente", unit: "A" },
                L: { label: "Comprimento", unit: "m" },
                theta: { label: "Ângulo θ", unit: "°", angle: true }
            },
            solve: {
                F: v => ({ value: v.B * v.I * v.L * sin(v.theta), expr: "F = B · I · L · sen(θ)" }),
                B: v => ({ value: v.F / (v.I * v.L * sin(v.theta)), expr: "B = F / (I · L · sen θ)" }),
                I: v => ({ value: v.F / (v.B * v.L * sin(v.theta)), expr: "I = F / (B · L · sen θ)" }),
                L: v => ({ value: v.F / (v.B * v.I * sin(v.theta)), expr: "L = F / (B · I · sen θ)" }),
                theta: v => {
                    const ratio = v.F / (v.B * v.I * v.L);
                    if (ratio > 1) return { error: "Sem solução: F é maior que B·I·L (sen θ > 1)." };
                    return { value: Math.asin(ratio) / deg, expr: "θ = arcsen(F / (B · I · L))", note: "O ângulo suplementar (180° − θ) também é solução." };
                }
            }
        },
        {
            id: "flux",
            area: "Indução",
            name: "Fluxo magnético",
            expr: "Φ = B · A · cos(θ)",
            vars: {
                Phi: { label: "Fluxo Φ", unit: "Wb" },
                B: { label: "Campo magnético", unit: "T" },
                A: { label: "Área", unit: "m²", noPrefix: true },
                theta: { label: "Ângulo θ", unit: "°", angle: true }
            },
            solve: {
                Phi: v => ({ value: v.B * v.A * cos(v.theta), expr: "Φ = B · A · cos(θ)" }),
                B: v => ({ value: v.Phi / (v.A * cos(v.theta)), expr: "B = Φ / (A · cos θ)" }),
                A: v => ({ value: v.Phi / (v.B * cos(v.theta)), expr: "A = Φ / (B · cos θ)" }),
                theta: v => {
                    const ratio = v.Phi / (v.B * v.A);
                    if (Math.abs(ratio) > 1) return { error: "Sem solução: |Φ| é maior que B·A (|cos θ| > 1)." };
                    return { value: Math.acos(ratio) / deg, expr: "θ = arccos(Φ / (B · A))" };
                }
            }
        },
        {
            id: "faraday",
            area: "Indução",
            name: "Lei de Faraday (módulo)",
            expr: "ε = N · ΔΦ / Δt",
            vars: {
                emf: { label: "FEM induzida ε", unit: "V" },
                N: { label: "Número de espiras", unit: "espiras", noPrefix: true },
                dPhi: { label: "Variação de fluxo ΔΦ", unit: "Wb" },
                dt: { label: "Intervalo de tempo Δt", unit: "s" }
            },
            solve: {
                emf: v => ({ value: v.N * Math.abs(v.dPhi) / v.dt, expr: "ε = N · |ΔΦ| / Δt" }),
                N: v => ({ value: v.emf * v.dt / Math.abs(v.dPhi), expr: "N = ε · Δt / |ΔΦ|" }),
                dPhi: v => ({ value: v.emf * v.dt / v.N, expr: "|ΔΦ| = ε · Δt / N" }),
                dt: v => ({ value: v.N * Math.abs(v.dPhi) / v.emf, expr: "Δt = N · |ΔΦ| / ε" })
            }
        },
        {
            id: "motional",
            area: "Indução",
            name: "FEM de movimento",
            expr: "ε = B · L · v",
            vars: {
                emf: { label: "FEM induzida ε", unit: "V" },
                B: { label: "Campo magnético", unit: "T" },
                L: { label: "Comprimento da barra", unit: "m" },
                v: { label: "Velocidade", unit: "m/s" }
            },
            solve: {
                emf: v => ({ value: v.B * v.L * v.v, expr: "ε = B · L · v" }),
                B: v => ({ value: v.emf / (v.L * v.v), expr: "B = ε / (L · v)" }),
                L: v => ({ value: v.emf / (v.B * v.v), expr: "L = ε / (B · v)" }),
                v: v => ({ value: v.emf / (v.B * v.L), expr: "v = ε / (B · L)" })
            }
        },
        {
            id: "transformer",
            area: "Indução",
            name: "Transformador ideal",
            expr: "U1 / U2 = N1 / N2",
            vars: {
                U1: { label: "Tensão no primário", unit: "V" },
                U2: { label: "Tensão no secundário", unit: "V" },
                N1: { label: "Espiras do primário", unit: "espiras", noPrefix: true },
                N2: { label: "Espiras do secundário", unit: "espiras", noPrefix: true }
            },
            solve: {
                U1: v => ({ value: v.U2 * v.N1 / v.N2, expr: "U1 = U2 · N1 / N2" }),
                U2: v => ({ value: v.U1 * v.N2 / v.N1, expr: "U2 = U1 · N2 / N1" }),
                N1: v => ({ value: v.N2 * v.U1 / v.U2, expr: "N1 = N2 · U1 / U2" }),
                N2: v => ({ value: v.N1 * v.U2 / v.U1, expr: "N2 = N1 · U2 / U1" })
            }
        }
    ];

    const historyStore = storage("physicslab.calc.history", []);
    let history = historyStore.load();
    let current = formulas[0];
    let target = Object.keys(current.vars)[0];
    const inputValues = {};

    function renderFormulaList() {
        let lastArea = "";
        formulaList.innerHTML = formulas.map(f => {
            const heading = f.area !== lastArea ? `<span class="calc-area-label">${f.area}</span>` : "";
            lastArea = f.area;
            return `
                ${heading}
                <button class="calc-formula-item ${f.id === current.id ? "active" : ""}" data-formula="${f.id}">
                    <strong>${f.name}</strong>
                    <span>${f.expr}</span>
                </button>
            `;
        }).join("");
    }

    function renderTargets() {
        targetContainer.innerHTML = Object.entries(current.vars).map(([key, meta]) => `
            <button class="calc-target ${key === target ? "active" : ""}" data-target="${key}">
                ${meta.label}
            </button>
        `).join("");
    }

    function prefixOptions(meta) {
        if (meta.angle || meta.noPrefix) return "";
        return `
            <select class="calc-prefix" aria-label="Prefixo da unidade">
                ${prefixes.map(p => `
                    <option value="${p.factor}" ${p.factor === 1 ? "selected" : ""}>${p.symbol}${meta.unit}</option>
                `).join("")}
            </select>
        `;
    }

    function renderInputs() {
        inputsContainer.innerHTML = Object.entries(current.vars)
            .filter(([key]) => key !== target)
            .map(([key, meta]) => {
                const saved = inputValues[`${current.id}.${key}`] ?? "";
                const unitBadge = meta.angle || meta.noPrefix
                    ? `<span class="calc-unit">${meta.unit}</span>`
                    : "";
                return `
                    <div class="calc-input" data-var="${key}">
                        <label>${meta.label}</label>
                        <div class="calc-input-row">
                            <input type="text" inputmode="decimal" placeholder="0" value="${escapeHTML(saved)}">
                            ${prefixOptions(meta)}${unitBadge}
                        </div>
                    </div>
                `;
            }).join("");

        formulaTitle.textContent = current.name;
        formulaExpr.textContent = current.expr;
        resultLabel.textContent = `${current.vars[target].label.toUpperCase()} CALCULADO(A)`;
        calculate();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = `<li class="calc-history-empty">Nenhum cálculo ainda. Os resultados aparecem aqui.</li>`;
            clearHistoryButton.hidden = true;
            return;
        }

        clearHistoryButton.hidden = false;
        historyList.innerHTML = history.map(item => `
            <li>
                <span>${escapeHTML(item.formula)}</span>
                <strong>${escapeHTML(item.result)}</strong>
            </li>
        `).join("");
    }

    function readValues() {
        const values = {};
        const missing = [];

        inputsContainer.querySelectorAll(".calc-input").forEach(group => {
            const key = group.dataset.var;
            const input = group.querySelector("input");
            const prefix = group.querySelector(".calc-prefix");
            const raw = parseNumber(input.value);

            inputValues[`${current.id}.${key}`] = input.value;
            input.classList.toggle("invalid", input.value.trim() !== "" && Number.isNaN(raw));

            if (Number.isNaN(raw)) {
                missing.push(current.vars[key].label);
                return;
            }

            values[key] = raw * (prefix ? Number(prefix.value) : 1);
        });

        return { values, missing };
    }

    function showMessage(message) {
        resultValue.textContent = "—";
        resultValue.classList.remove("error");
        stepsBox.innerHTML = `<p class="calc-hint">${message}</p>`;
    }

    function calculate() {
        const { values, missing } = readValues();

        if (missing.length > 0) {
            showMessage(`Preencha: ${missing.join(", ")}.`);
            return null;
        }

        const outcome = current.solve[target](values);

        if (outcome.error || !Number.isFinite(outcome.value)) {
            resultValue.textContent = "Indefinido";
            resultValue.classList.add("error");
            stepsBox.innerHTML = `<p class="calc-hint">${outcome.error || "Divisão por zero ou combinação de valores inválida. Verifique os dados."}</p>`;
            return null;
        }

        const meta = current.vars[target];
        const formatted = meta.angle
            ? `${formatNumber(outcome.value, 2)}°`
            : meta.noPrefix
                ? `${formatNumber(outcome.value, 2)} ${meta.unit}`
                : formatSI(outcome.value, meta.unit);

        resultValue.textContent = formatted;
        resultValue.classList.remove("error");

        const given = Object.entries(values).map(([key, value]) => {
            const m = current.vars[key];
            const shown = m.angle ? `${formatNumber(value)}°` : `${formatNumber(value)} ${m.unit}`;
            return `<li><span>${m.label}</span><strong>${shown}</strong></li>`;
        }).join("");

        stepsBox.innerHTML = `
            <div class="calc-step"><span>1</span><div>Dados convertidos para o SI:<ul>${given}</ul></div></div>
            <div class="calc-step"><span>2</span><div>Isolando a incógnita:<div class="formula">${outcome.expr}</div></div></div>
            <div class="calc-step"><span>3</span><div>Resultado: <strong>${formatted}</strong>${outcome.note ? `<p class="calc-note">${outcome.note}</p>` : ""}</div></div>
        `;

        return { formatted };
    }

    function saveToHistory() {
        const result = calculate();
        if (!result) return;

        const entry = {
            formula: `${current.name} · ${current.vars[target].label}`,
            result: result.formatted
        };

        if (history[0] && history[0].formula === entry.formula && history[0].result === entry.result) return;

        history = [entry, ...history].slice(0, 8);
        historyStore.save(history);
        renderHistory();
    }

    formulaList.addEventListener("click", event => {
        const button = event.target.closest("[data-formula]");
        if (!button) return;
        current = formulas.find(f => f.id === button.dataset.formula);
        target = Object.keys(current.vars)[0];
        renderFormulaList();
        renderTargets();
        renderInputs();
    });

    targetContainer.addEventListener("click", event => {
        const button = event.target.closest("[data-target]");
        if (!button) return;
        target = button.dataset.target;
        renderTargets();
        renderInputs();
    });

    inputsContainer.addEventListener("input", calculate);
    inputsContainer.addEventListener("change", calculate);

    document.getElementById("calc-save").addEventListener("click", saveToHistory);

    inputsContainer.addEventListener("keydown", event => {
        if (event.key === "Enter") saveToHistory();
    });

    clearHistoryButton.addEventListener("click", () => {
        history = [];
        historyStore.save(history);
        renderHistory();
    });

    renderFormulaList();
    renderTargets();
    renderInputs();
    renderHistory();
});
