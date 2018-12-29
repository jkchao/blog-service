module.exports = [
  {
    type: 'list',
    name: 'checkType',
    message: 'Select the type to check',
    default: 'Event Loop',
    choices: [
      {
        name: 'doctor -- Event Loop、GC、I/O、Sync I/O',
        value: 'doctor'
      },
      {
        name: 'IO',
        value: 'bubbleprof'
      },
      {
        name: 'flame -- 火焰图',
        value: 'flame'
      }
    ]
  }
];
