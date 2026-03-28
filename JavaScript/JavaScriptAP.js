// Función para formatear números en formato $ XX.XXX,XX
function formatCurrency(value) {
    // Convertir a string con 2 decimales
    const parts = value.toFixed(2).split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];

    // Añadir separadores de miles (.)
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Unir la parte entera con la decimal
    return `$ ${integerPart},${decimalPart}`;
}

// Obtener contexto del canvas
const ctx = document.getElementById('myChart').getContext('2d');
let chart = null;

document.getElementById('generateBtn').addEventListener('click', () => {
    // Obtener los valores ingresados, usando 0 si están vacíos
    const valores = [
        parseFloat(document.getElementById('range1').value) || 0,
        parseFloat(document.getElementById('range2').value) || 0,
        parseFloat(document.getElementById('range3').value) || 0,
        parseFloat(document.getElementById('range4').value) || 0,
        parseFloat(document.getElementById('range5').value) || 0
    ];

    // Calcular la suma total
    const total = valores.reduce((acc, val) => acc + val, 0);

    // Calcular porcentajes relativos
    const porcentajes = total > 0 ? valores.map(val => (val / total) * 100) : [0, 0, 0, 0, 0];

    // Etiquetas
    const etiquetas = ['1-30 días', '31-60 días', '61-90 días', '91-180 días', '+180 días'];

    // Destruir gráfico previo si existe
    if (chart) {
        chart.destroy();
    }

    // Crear nuevo gráfico
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Monto ($)',
                data: valores,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Resumen de Cuentas por Pagar por Rangos de Tiempo'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const valor = valores[index];
                            const porcentaje = total > 0 ? (valor / total) * 100 : 0;
                            return `${formatCurrency(valor)} (${porcentaje.toFixed(2)}%)`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'center',
                    align: 'center',
                    formatter: function(value, context) {
                        const index = context.dataIndex;
                        const porcentaje = total > 0 ? (value / total) * 100 : 0;
                        // Formatear valor y porcentaje
                        const valueStr = formatCurrency(value);
                        const porcentajeStr = porcentaje.toFixed(2) + '%';
                        // Retornar en varias líneas
                        return `${valueStr}\n(${porcentajeStr})`;
                    },
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
});
