var gulp = require('gulp'); //引入定义的模块
var $ = require('gulp-load-plugins')();//加()实例化
var open = require('open');
//定义目录
var app = {
	srcPath:'src/', //代码编写目录
	devPath:'build/', //测试目录
	proPath:'dist/' //生产目录
};
//编写第一个任务   .task 定义任务 .src读取文件   .dest拷贝
//执行 gulp 任务名
//当所有的逻辑都执行完成的时候    在测试和生产目录里都拷贝一份js文件
gulp.task('first',function(){
	gulp.src('bower_components/**/*.js')
	.pipe(gulp.dest(app.devPath+'vendor'))
	.pipe(gulp.dest(app.proPath+'vendor'))
	.pipe($.connect.reload())
});
//把html模板文件  拷贝到开发和生产目录      执行用gulp.html
gulp.task('html',function(){
	gulp.src(app.srcPath+'**/*.html')
	.pipe(gulp.dest(app.devPath))
	.pipe(gulp.dest(app.proPath))
	.pipe($.connect.reload())  
	//  //让浏览器自动刷新
})

// 拷贝视图
 gulp.task('view',function(){
	gulp.src(app.srcPath+'view/*.html')
	.pipe(gulp.dest(app.devPath+'view'))
	.pipe(gulp.dest(app.proPath+'view'))
	.pipe($.connect.reload())  
	//  //让浏览器自动刷新
})



//拷贝js
gulp.task('js',function(){
   gulp.src(app.srcPath+'js/**/*.js')
   .pipe($.concat('index.js'))
   .pipe(gulp.dest(app.devPath+'js'))
   .pipe($.uglify())
    .pipe(gulp.dest(app.proPath+'js'))
   .pipe($.connect.reload())
})


//编译less并拷贝到开发和生产目录
//生产目录  需要压缩
gulp.task('less',function(){
	gulp.src(app.srcPath+'css/index.less')
	.pipe($.less())
	.pipe(gulp.dest(app.devPath+'css'))
	.pipe($.cssmin())
	.pipe(gulp.dest(app.proPath+'css'))
	.pipe($.connect.reload())
})


//把data目录拷贝到开发和生产目录
gulp.task('json',function(){
	gulp.src(app.srcPath+'data/**/*.json')
	.pipe(gulp.dest(app.devPath+'data'))
	.pipe(gulp.dest(app.proPath+'data'))
	.pipe($.connect.reload())  
	///让浏览器自动刷新
})

//图片的压缩   拷贝

gulp.task('image',function(){
	gulp.src(app.srcPath+'image/**/*')
	.pipe(gulp.dest(app.devPath+'image'))
	.pipe($.imagemin())
	.pipe(gulp.dest(app.proPath+'image'))
	.pipe($.connect.reload())  
	///让浏览器自动刷新
})


//删除的任务  不希望之前的代码产生影响 才用
gulp.task('clean',function(){
	//src想传多个数据用数组的形式
	gulp.src([app.devPath,app.proPath])
	.pipe($.clean())
})


//任务的汇总
gulp.task('build',['first','html','view','less','image','json','js'])

//启动服务的任务
gulp.task('serve',['build'],function(){
	$.connect.server({
		root:[app.devPath],
		livereload:true,
		port:0811
	});
	open('http://localhost:0811');
	//监控文件变化  进行编译
	gulp.watch('bower_components/**/*',['first']);
	gulp.watch(app.srcPath+'**/*.html',['html']);
	gulp.watch(app.srcPath+'view/*.html',['view']);
	gulp.watch(app.srcPath+'css/**/*.less',['less']);
	gulp.watch(app.srcPath+'data/**/*.json',['json']);
	gulp.watch(app.srcPath+'image/**/*',['image']);
	gulp.watch(app.srcPath+'js/**/*.js',['js']);

})