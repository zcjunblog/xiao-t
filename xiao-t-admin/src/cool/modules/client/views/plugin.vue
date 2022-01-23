<template>
	<cl-crud :ref="setRefs('crud')" @load="onLoad">
		<el-row type="flex" align="middle">
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="输入框架名称进行搜索" />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table :ref="setRefs('table')" v-bind="table">
				<!-- <template #column-name="{ scope }"> {{ scope.row.name }}，你好 </template> -->
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</el-row>

		<!-- 新增、编辑 -->
		<cl-upsert :ref="setRefs('upsert')" v-bind="upsert" :on-submit="onUpsertSubmit" />
	</cl-crud>
</template>

<script lang="ts">
import { toRefs, defineComponent, inject, reactive } from "vue"
import { CrudLoad, Upsert, Table } from "cl-admin-crud-vue3/types"
import { useRefs } from "/@/core"
// import { ElMessage } from "element-plus"

export default defineComponent({
	name: "cli-template",
	setup() {
		const { refs, setRefs } = useRefs()
		// 请求服务
		const service = inject<any>("service")
		const state: any = reactive({})
		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: [
				{
					label: "插件名称",
					prop: "name",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写插件名称"
						}
					},
					rules: {
						required: true,
						message: "名称不能为空"
					}
				},
				{
					label: "图标链接",
					prop: "icon",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写克隆地址"
						}
					},
					rules: {
						required: true,
						message: "图标链接不能为空"
					}
				},
				{
					label: "下载地址",
					prop: "downloadUrl",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写下载地址"
						}
					},
					rules: {
						required: true,
						message: "下载地址不能为空"
					}
				},
				{
					label: "相关描述",
					prop: "desc",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写相关描述"
						}
					}
				},
				{
					label: "配置文件",
					prop: "pluginJson",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写plugin.json的内容",
							type: "textarea",
							rows: 8
						}
					},
					rules: {
						required: true,
						message: "配置文件不能为空"
					}
				}
			]
		})

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "createTime",
					order: "descending"
				}
			},
			columns: [
				{
					label: "插件名称",
					prop: "name",
					minWidth: 150
				},
				{
					label: "插件描述",
					prop: "desc",
					minWidth: 180
				},
				{
					label: "图标链接",
					prop: "icon"
				},
				{
					label: "下载地址",
					prop: "downloadUrl"
				},
				{
					label: "创建时间",
					prop: "createTime",
					sortable: "true",
					minWidth: 140
				},
				{
					// 操作栏
					type: "op",
					align: "center",
					buttons: ["edit", "delete"]
				}
			]
		})

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			// 绑定 service
			ctx.service(service.client.plugin).done()
			app.refresh()
		}
		// 提交钩子
		function onUpsertSubmit(_: boolean, data: any, { next }: any) {
			delete data.createTime
			delete data.updateTime
			console.log(data)
			next({
				...data
			})
		}

		return {
			refs,
			setRefs,
			upsert,
			table,
			onLoad,
			onUpsertSubmit,
			...toRefs(state)
		}
	}
})
</script>
