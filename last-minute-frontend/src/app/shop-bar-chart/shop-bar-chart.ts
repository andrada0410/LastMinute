import { Component, input, ViewChild, ElementRef, effect } from '@angular/core';
import * as d3 from 'd3';
import { ShopReservationStatistics } from '../reservation';

@Component({
  selector: 'app-shop-bar-chart',
  standalone: true,
  template: `
    <div class="chart-wrapper">
      <div class="chart-legend">
        <div class="legend-item">
          <span class="legend-color listed"></span>
          <span>Cantitate listată</span>
        </div>
        <div class="legend-item">
          <span class="legend-color sold"></span>
          <span>Cantitate vândută</span>
        </div>
      </div>
      @if (!data() || data().length === 0) {
        <div class="empty-state">
          <p>Nu există date de afișat, deoarece nu există oferte create.</p>
        </div>
      } @else {
        <div #barChart id="bar-chart" class="chart-container"></div>
      }
    </div>
  `,
  styleUrls: ['./shop-bar-chart.css']
})
export class ShopBarChart {
  @ViewChild('barChart')
  private chartContainer!: ElementRef<HTMLDivElement>;

  public data = input<ShopReservationStatistics[]>([]);

  margin = { top: 30, right: 20, bottom: 100, left: 50 };

  constructor() {
    effect(() => {
      if (this.data() && this.data().length > 0) {
        this.renderWithDelay();
      }
    });
  }

  private renderWithDelay(): void {
    setTimeout(() => {
      this.createChart();
    }, 100);
  }

  private createChart(): void {
    if (!this.chartContainer || !this.data() || this.data().length === 0) {
      return;
    }

    const element = this.chartContainer.nativeElement;

    d3.select(element).selectAll('*').remove();

    const width = element.offsetWidth > 0 ? element.offsetWidth : 700;
    const height = element.offsetHeight > 0 ? element.offsetHeight : 380;

    const contentWidth = width - this.margin.left - this.margin.right;
    const contentHeight = height - this.margin.top - this.margin.bottom;

    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height);

    const x0 = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.4)
      .domain(this.data().map((d: ShopReservationStatistics) => d.productName));
    
    const x1 = d3
      .scaleBand()
      .range([0, x0.bandwidth()])
      .padding(0.1)
      .domain(['listed', 'sold']);

    const maxQuantity = d3.max(
      this.data(),
      (d: ShopReservationStatistics) => Math.max(d.listedQuantity, d.soldQuantity)
    ) ?? 0;

    const y = d3
      .scaleLinear()
      .range([contentHeight, 0])
      .domain([0, maxQuantity])
      .nice();

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const xAxis = g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${contentHeight})`)
      .call(d3.axisBottom(x0));

    const max_length = 20;

    xAxis.selectAll('text')
    .each(function() {
        const textNode = d3.select(this);
        const text = textNode.text();

        const words = text.split(' ');
        if (text.length > max_length && words.length > 1) {
          const middle = Math.ceil(words.length / 2);
          const line1 = words.slice(0, middle).join(' ');
          const line2 = words.slice(middle).join(' ');

          textNode.text('');

          textNode.append('tspan')
            .attr('x', 0)
            .attr('dy', '0.71em')
            .text(line1);

          textNode.append('tspan')
            .attr('x', 0)
            .attr('dy', '1.1em')
            .text(line2);
        }
      })
      .attr('transform', 'rotate(-25)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em');

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(Math.min(maxQuantity, 5)).tickFormat(d3.format('d')))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -contentHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Cantitate');

    const productGroups = g
      .selectAll('.product-group')
      .data(this.data())
      .enter()
      .append('g')
      .attr('class', 'product-group')
      .attr('transform', (d: ShopReservationStatistics) => `translate(${x0(d.productName) ?? 0}, 0)`);

    productGroups
      .append('rect')
      .attr('class', 'bar listed')
      .attr('x', x1('listed') ?? 0)
      .attr('y', (d: ShopReservationStatistics) => y(d.listedQuantity))
      .attr('width', x1.bandwidth())
      .attr('height', (d: ShopReservationStatistics) => contentHeight - y(d.listedQuantity))
      .attr('rx', 4);

    productGroups
      .append('rect')
      .attr('class', 'bar sold')
      .attr('x', x1('sold') ?? 0)
      .attr('y', (d: ShopReservationStatistics) => y(d.soldQuantity))
      .attr('width', x1.bandwidth())
      .attr('height', (d: ShopReservationStatistics) => contentHeight - y(d.soldQuantity))
      .attr('rx', 4);

    productGroups
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (x1('listed') ?? 0) + x1.bandwidth() / 2)
      .attr('y', (d: ShopReservationStatistics) => y(d.listedQuantity) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text((d: ShopReservationStatistics) => d.listedQuantity > 0 ? d.listedQuantity : 0);

    productGroups
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (x1('sold') ?? 0) + x1.bandwidth() / 2)
      .attr('y', (d: ShopReservationStatistics) => y(d.soldQuantity) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text((d: ShopReservationStatistics) => d.soldQuantity > 0 ? d.soldQuantity : 0);
  }
}