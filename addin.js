const $=id=>document.getElementById(id),fmt=n=>'$'+Math.round(n).toLocaleString();
const qs=[{
  id:'priority',q:'What is your top fleet priority?',s:'Choose the business issue you want to solve first.',o:[['safety','Improve driver safety / reduce accidents'],['tracking','GPS tracking and accountability'],['compliance','ELD, HOS, DVIR, IFTA compliance'],['assets','Track trailers, equipment, and assets']]
},{
  id:'fleet',q:'What type of fleet do you operate?',s:'This helps match the right platform and product mix.',o:[['field','Field service / pickup / van fleet'],['transport','Trucking / transportation'],['construction','Construction / equipment'],['delivery','Distribution / delivery']]
},{
  id:'video',q:'How important is video safety?',s:'Dash cameras can be optional, basic, or the center of the safety program.',o:[['none','Not ready for cameras yet'],['road','Road-facing protection'],['dual','Road + driver AI coaching'],['multi','Multi-camera visibility']]
},{
  id:'decision',q:'What would help you move forward?',s:'This helps shape the next step after the meeting.',o:[['overview','Understand the options'],['pilot','Run a pilot first'],['roi','See ROI / cost impact'],['quote','Build a proposal']]
}];
let step=0,answers={
};
function recommendation(){
  if(answers.priority==='assets'||answers.fleet==='construction')return['Asset-Heavy Fleet Visibility','GO ANYWHERE + DIGITAL MATTER','Start with GO Anywhere, then add Digital Matter trackers where deeper asset visibility is needed.','GO ANYWHERE / GO ASSET PRO'];
  if(answers.priority==='compliance'||answers.fleet==='transport')return['Advanced Fleet Management + Compliance','GEOTAB','Geotab is the strongest fit for ELD, HOS, DVIR, IFTA, diagnostics, maintenance, and enterprise fleet intelligence.','GO ADVANCED / GO SAFETY PLUS'];
  if(answers.priority==='safety'||['road','dual','multi'].includes(answers.video))return['Video Safety + Driver Coaching','ZenduONE or Geotab GO Focus','Start with the safety goal first: road-facing, dual-view AI, or multi-camera visibility.','GO SAFETY / GO SAFETY PLUS / ZenduONE Enterprise'];
  return['Fleet Visibility + Accountability','GEOTAB or ZenduONE','A GPS-first program gives visibility, accountability, reporting, and a clean path to add cameras or assets later.','GO BASE / GO ADVANCED / ZenTRACK GPS']
}
function renderAssessment(){
  const el=$('assessment');
  if(step>=qs.length){
    const r=recommendation();
    el.innerHTML=`<div class="progress">${qs.map(()=>'<span class="done"></span>').join('')}</div><div class="result-card"><small>RECOMMENDED DIRECTION</small><h3>${r[0]}</h3><h4>${r[1]}</h4><p>${r[2]}</p><div class="result-start"><span>Based on your responses, most fleets like yours start here:</span><strong>${r[3]}</strong></div><div class="cta-row"><a class="btn primary" href="#pricing">View Recommended Plans</a><button class="btn ghost" onclick="step=0;answers={};renderAssessment()">Restart</button></div></div>`;
    return
  }
  const q=qs[step];
  el.innerHTML=`<div class="progress">${qs.map((_,i)=>`<span class="${i<step?'done':i===step?'active':''}"></span>`).join('')}</div><div class="tool-card"><small>STEP ${step+1} / ${qs.length}</small><h3>${q.q}</h3><p>${q.s}</p><div class="options">${q.o.map(x=>`<button onclick="answers['${q.id}']='${x[0]}';step++;renderAssessment()">${
    x[1]
  }
  </button>`).join('')}</div><button class="btn ghost" ${step===0?'disabled':''} onclick="step=Math.max(0,step-1);renderAssessment()">Back</button></div>`
}
const eco={
  geotab:['Geotab Platform','GO9 / GO10 • GO Rugged • GO Anywhere','ELD / HOS / DVIR • 500+ integrations'],focus:['GO Focus Cameras','Event • Plus • Pro models','ADAS + DMS AI • Live stream • Video evidence'],asset:['Asset Tracking','GO Anywhere • Digital Matter','Yabby • Oyster • Remora • Barra'],zendu:['ZenduONE Platform','ZenTRACK • ZenCAM LITE / PLUS','Standalone or Geotab-integrated workflows'],coaching:['Driver Coaching','AI coaching workflows','Video app • scoring • feedback'],lytx:['LytxONE','Video + GPS + maintenance','Plug-in multi-camera • Lytx AI']
};
document.querySelectorAll('[data-eco]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-eco]').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  let d=eco[b.dataset.eco];
  $('eco-title').textContent=d[0];
  $('eco-sub').textContent=d[1];
  $('eco-small').textContent=d[2]
});
const cost=[['20%','Crash Yearly','One in five commercial fleets experiences a crash each year.'],['$5K+','Property Damage','Even minor incidents quickly exceed $5,000 once repairs and downtime are included.'],['$26K','Avg Cost','A fleet accident creates a meaningful operational cost.'],['$75K+','Injury Crash','Injury claims add medical costs, workers comp, insurance pressure, and brand risk.'],['$750K+','Fatal Crash','Severe events can threaten the business through liability, legal expense, and reputational loss.']];
function setCost(i){
  $('cost-title').textContent=cost[i][0]+' — '+cost[i][1];
  $('cost-detail').textContent=cost[i][2];
  document.querySelectorAll('#cost-bubbles button').forEach((b,j)=>b.classList.toggle('on',i===j))
}
$('cost-bubbles').innerHTML=cost.map((d,i)=>`<button onclick="setCost(${i})"><strong>${d[0]}</strong><span>${d[1]}</span></button>`).join('');
setCost(0);
const reactRows=[['Undistracted Driver','Baseline (1 sec)','30%','A focused driver can respond in about one second.'],['At Drink-Drive Limit','+13% slower','42%','Even legal-limit impairment can slow response.'],['Hands-Free Phone','+27% slower','58%','Hands-free does not mean distraction-free.'],['Texting While Driving','+37% slower','74%','Texting combines visual, manual, and cognitive distraction.'],['Hand-Held Phone','+46% slower','88%','One of the worst measured behaviors for reaction speed.']];
function setReact(i){
  $('react-title').textContent=reactRows[i][0];
  $('react-detail').textContent=reactRows[i][3]
}
$('reaction').innerHTML=reactRows.map((r,i)=>`<div onmouseenter="setReact(${i})"><span>${r[0]}</span><b style="width:${r[2]}">${r[1]}</b></div>`).join('');
setReact(3);
function calc(){
  let v=+$('v').value||0,m=+$('m').value||0,f=+$('f').value||0,g=+$('g').value||1,a=+$('a').value||0,c=+$('c').value||0;
  let fuel=(v*m/g)*f*.3,acc=a*26081*.6,ops=v*3000*.15,inv=v*34.99*12,net=fuel+acc+ops+(v*c*12)-inv;
  $('fuel').textContent=fmt(fuel);
  $('accident').textContent=fmt(acc);
  $('ops').textContent=fmt(ops);
  $('investment').textContent=fmt(inv);
  $('net').textContent=fmt(net)
}
['v','m','f','g','a','c'].forEach(id=>$(id).addEventListener('input',calc));
calc();
const savings=[['$228K','Fuel Savings',46,'blue','Fuel Savings = (100 vehicles × 30,000 annual miles ÷ 15 MPG × $3.80/gal) × estimated fuel improvement.'],['$312K','Accident Savings',58,'greenish','Accident Savings = 20 incidents × $26,081 average accident cost × 60% reduction.'],['$45K','Ops Savings',28,'orangebar','Operational Savings = estimated 15% efficiency improvement.'],['~$50K','Insurance',32,'purple','Insurance impact is modeled from lower claims and stronger evidence.'],['-$48K','Traxxis Cost',22,'redbar','Traxxis Cost = annual bundled safety-plan investment.'],['$587K','Net Savings',78,'greenish','Net = Fuel + Accident + Operational + Insurance impact − Traxxis Cost.']];
function setSave(i){
  $('save-title').textContent=savings[i][1]+': '+savings[i][0];
  $('save-detail').textContent=savings[i][4]
}
$('savings-chart').innerHTML=savings.map((s,i)=>`<div class="save-col" onmouseenter="setSave(${i})"><b>${s[0]}</b><div class="save-track"><span class="${s[3]}" style="height:${s[2]}%"></span></div><strong>${s[1]}</strong></div>`).join('');
setSave(0);
const comp=[['Years in Business','24+ Years (Since 2002)','~10 Years','~10 Years','~20 Years'],['Platform Options','Geotab + ZenduONE + LytxONE','Single','Single','Limited'],['Hardware Included','All Bundled Plans','Separate','Separate','Varies'],['Dedicated Support','Direct Expert Access','Scaled','Scaled','Tiered'],['Professional Install','Full Install Service','Self-Install','Self-Install','Extra Fee'],['Camera Options','GO Focus + ZenCAM + LytxONE','Yes','Yes','Limited']];
$('comp-body').innerHTML=comp.map(r=>`<tr><td>${r[0]}</td><td class="traxxis-col"><span class="check">✓</span><strong>${r[1]}</strong></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('');
const faqs=[['How does Traxxis compare to Samsara or other providers?','We represent multiple best-in-class platforms, so we match the technology to your operation.'],['Are your prices competitive?','Yes — the better comparison is total cost of ownership with hardware, onboarding, and support.'],['We already have GPS. Why switch?','Modern fleets need AI cameras, coaching, asset tracking, compliance tools, and integrated support.'],['Is a 3-year agreement necessary?','It allows us to include hardware with no upfront cost and support the deployment properly.'],['Will drivers be comfortable with cameras?','Drivers quickly understand video protects them from false claims and helps coach safer habits.'],['How quickly can we deploy?','Most fleets are operational within a few weeks depending on fleet size and scope.']];
let openFaq=0;
function renderFaq(){
  $('faq-list').innerHTML=faqs.map((f,i)=>`<div class="faq-item"><button onclick="openFaq=${openFaq===i?-1:i};renderFaq()"><span>${f[0]}</span><b>${openFaq===i?'−':'+'}</b></button>${openFaq===i?`<p>${
    f[1]
  }
  </p>`:''}</div>`).join('')
}
renderFaq();
const times=[['D1','Sign & Order','Agreement executed and onboarding begins.'],['W1','Hardware Ships','Pre-configured devices ship ready to install.'],['W3','Install & Training','Onsite install and training completed.'],['M1','Go Live','Fleet is fully operational.'],['M3-6','Break-Even','Savings exceed monthly investment.'],['YB1+','Full ROI','Long-term savings and optimization.']];
function setTime(i){
  $('time-title').textContent=times[i][1];
  $('time-detail').textContent=times[i][2];
  document.querySelectorAll('#timeline-line button').forEach((b,j)=>b.classList.toggle('on',i===j))
}
$('timeline-line').innerHTML=times.map((t,i)=>`<button onclick="setTime(${i})"><b>${t[0]}</b><span>${t[1]}</span></button>`).join('');
setTime(0);
const plans={
  geotab:[['GO ANYWHERE','$14','.99/mo',['Portable asset tracking','No wiring or install needed','Long battery life','Bluetooth beacon support','Trailers, equipment, containers']],['GO BASE','$19','.99/mo',['Real-time GPS tracking','Trip history & replay','Geofencing & zone alerts','Unlimited users','Lifetime GO device warranty']],['GO ADVANCED','$29','.99/mo',['Everything in GO BASE','Engine diagnostics','Fuel tracking','Driver scorecards','Maintenance alerts','DVIR']],['GO SAFETY','$34','.99/mo',['Everything in GO ADVANCED','GO Focus event camera','Collision detection','Tailgating alerts','Event video upload']],['GO SAFETY PLUS','$39','.99/mo',['Everything in GO SAFETY','GO Focus Plus dual-view AI','Road + driver view','Live streaming','Remote retrieval','Driver coaching'],true]],zendu:[
  ['ZenTRACK GPS','$19','.99/mo',['GPS tracking','Trip replay','Driver behavior','ZenduONE web + mobile']],
  ['ZenCAM SAFETY','$34','.99/mo',['ZenCAM LITE or PLUS','Road + Driver View','360-Degree View','ADAS + DMS','LIVESTREAM Video','GPS Tracking']],
  ['ZenCAM SAFETY PLUS','$39','.99/mo',['Everything in SAFETY','Video retrieval','Facial AI assignment','DVIR forms','Advanced coaching'],true],
  ['ZenCAM SAFETY PRO','$44','.99/mo',['Everything in SAFETY PLUS','Human Review Service','8-Minute Video Retrieval','Real-Time GPS Tracking']]
],lytx:[
    ['LYTXONE ASSET','$14','.99/mo',['Battery asset tracker','Trailer & equipment visibility','Long-life battery platform','Portable deployment','Theft recovery support']],
    ['LYTXONE TRACK','$19','.99/mo',['OBDII vehicle tracker','Real-time GPS tracking','Trip history & visibility','Driver accountability','Fleet utilization insights']],
    ['LYTXONE SAFETY','$29','.99/mo',['Video-only safety platform','Event-triggered recording','Driver behavior review','Incident evidence capture','Coaching workflows']],
    ['LYTXONE SAFETY PLUS','$34','.99/mo',['All-in-one video + telematics','AI safety monitoring','GPS + driver visibility','Video event management','Integrated fleet insights'],true]
  ],asset:[
  ['GO ANYWHERE BASE','$11','.99/mo',['Geotab platform only','Portable asset tracking','No wiring or install needed','Long battery life','Best for simple location visibility']],
  ['GO ANYWHERE PRO','$14','.99/mo',['Geotab platform only','Everything in BASE','Bluetooth + beacon integration options','Powered option available','Enhanced asset visibility']],
  ['GO ASSET','$19','.99/mo',['Digital Matter Yabby, Oyster, or Barra','Works on Geotab or ZenduONE','Battery-powered asset tracking','Trailer, equipment, and container visibility','Flexible deployment options']],
  ['GO ASSET PRO','$29','.99/mo',['Digital Matter Remora','Works on Geotab or ZenduONE','Ultra-long battery','Tamper detection','High-value assets'],true]
]
};
const tabLabels=[['geotab','Geotab Plans'],['zendu','ZenduONE Plans'],['lytx','LytxONE Plans'],['asset','Asset Tracking Plans']];
let currentTab='geotab';
function renderPlans(){
  $('tabs').innerHTML=tabLabels.map(t=>`<button class="${currentTab===t[0]?'on':''}" onclick="currentTab='${t[0]}';renderPlans()">${t[1]}</button>`).join('');
  $('price-grid').className='price-grid '+(currentTab==='geotab'?'five':'');
  $('price-grid').innerHTML=plans[currentTab].map(p=>`<div class="price-card ${p[4]?'popular':''}">${p[4]?'<b class="ribbon">MOST POPULAR</b>':''}<h3>${p[0]}</h3><div class="price">${p[1]}<span>${p[2]}</span></div><ul>${p[3].map(f=>`<li>✓ ${
    f
  }
  </li>`).join('')}</ul></div>`).join('')
}
renderPlans();
renderAssessment();

