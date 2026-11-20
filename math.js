(function(root){
  'use strict';
  function electrical(powerKw, phases, powerFactor) {
    if (!Number.isFinite(powerKw) || powerKw < 0 || ![1,3,'1','3'].includes(phases) ||
        !Number.isFinite(powerFactor) || powerFactor <= 0 || powerFactor > 1) return null;
    const voltage = String(phases) === '3' ? 400 : 230;
    const current = powerKw * 1000 / (String(phases) === '3' ? Math.sqrt(3)*voltage*powerFactor : voltage*powerFactor);
    return { voltage, current };
  }
  function insulationThickness(diameterMm, conductivity, lineResistance) {
    if (![diameterMm,conductivity,lineResistance].every(Number.isFinite) ||
        diameterMm <= 0 || conductivity <= 0 || lineResistance <= 0) return null;
    const exponent = 2*Math.PI*conductivity*lineResistance;
    const rawThickness = (diameterMm/2000)*(Math.exp(Math.min(exponent,5))-1);
    return { exponent, rawThickness, thickness: Math.min(rawThickness,0.5) };
  }
  function darcyFrictionFactor(reynolds, roughnessMm, diameterMm) {
    if (![reynolds,roughnessMm,diameterMm].every(Number.isFinite) ||
        reynolds <= 0 || roughnessMm < 0 || diameterMm <= 0) return null;
    const turbulent = re => 0.25/Math.pow(Math.log10(roughnessMm/(3.7*diameterMm)+5.74/Math.pow(re,0.9)),2);
    let factor, regime;
    if (reynolds < 2300) { factor=64/reynolds; regime='laminar'; }
    else if (reynolds < 4000) {
      const f0=64/2300, f1=turbulent(4000), blend=(reynolds-2300)/1700;
      factor=f0+(f1-f0)*blend; regime='transition';
    } else { factor=turbulent(reynolds); regime='turbulent'; }
    return { factor, regime };
  }
  const api={electrical,insulationThickness,darcyFrictionFactor};
  root.HVACMath=api;
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
