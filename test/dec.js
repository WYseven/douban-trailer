// 装饰器，用来装饰类
@constroller
class Boy {
  @speak(123) // 用来装饰 类上的属性
  run () {
    console.log('run')
  }
}

function speak(params) {
  return function (target,name,dec) {
    console.log(params,target, name, dec)
  }
}

function constroller(target) {
  console.log(target)
  target.prototype.miaov = 1;
}

let b = new Boy();

b.run();

console.log(b.miaov)