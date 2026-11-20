const test = require('node:test');
const assert = require('node:assert/strict');
const HVACMath = require('../math.js');

test('электрика: однофазная сеть 230 В', () => {
  const r=HVACMath.electrical(3.5,1,0.9);
  assert.equal(r.voltage,230);
  assert.ok(Math.abs(r.current-16.9082)<0.001);
});
test('электрика: трёхфазная сеть 400 В', () => {
  const r=HVACMath.electrical(10,3,0.9);
  assert.equal(r.voltage,400);
  assert.ok(Math.abs(r.current-16.0375)<0.001);
});
test('электрика: недопустимые входы отклоняются', () => {
  assert.equal(HVACMath.electrical(-1,1,0.9),null);
  assert.equal(HVACMath.electrical(1,1,0),null);
  assert.equal(HVACMath.electrical(1,2,0.9),null);
});
test('изоляция: контрольный расчёт цилиндра', () => {
  const r=HVACMath.insulationThickness(100,0.04,0.7);
  assert.ok(Math.abs(r.thickness-0.00962)<0.00001);
});
test('изоляция: невалидные данные и ограничение результата', () => {
  assert.equal(HVACMath.insulationThickness(0,0.04,0.7),null);
  const r=HVACMath.insulationThickness(100,1,100);
  assert.equal(r.thickness,0.5);
  assert.ok(r.rawThickness>0.5);
});
test('Дарси: ламинарный режим', () => {
  const r=HVACMath.darcyFrictionFactor(1000,0.0015,32);
  assert.equal(r.regime,'laminar');
  assert.equal(r.factor,0.064);
});
test('Дарси: переходная область непрерывна на границах интерполяции', () => {
  const a=HVACMath.darcyFrictionFactor(2300,0.0015,32);
  const b=HVACMath.darcyFrictionFactor(4000,0.0015,32);
  const c=HVACMath.darcyFrictionFactor(4000.001,0.0015,32);
  assert.ok(Math.abs(a.factor-64/2300)<1e-12);
  assert.ok(Math.abs(b.factor-c.factor)<0.001);
});
test('Дарси: турбулентный режим и входная валидация', () => {
  const r=HVACMath.darcyFrictionFactor(40000,0.0015,32);
  assert.equal(r.regime,'turbulent');
  assert.ok(r.factor>0.01 && r.factor<0.04);
  assert.equal(HVACMath.darcyFrictionFactor(0,0.0015,32),null);
});
