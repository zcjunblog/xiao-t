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
			<cl-search-key />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table :ref="setRefs('table')" v-bind="table" />
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
import { defineComponent, inject, reactive } from "vue"
import { CrudLoad, Upsert, Table } from "cl-admin-crud-vue3/types"
import { useRefs } from "/@/core"
import { ElMessage } from "element-plus"

export default defineComponent({
	name: "cli-template",
	setup() {
		const { refs, setRefs } = useRefs()
		// 请求服务
		const service = inject<any>("service")

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: [
				{
					label: "模板名称",
					prop: "name",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写模板名称"
						}
					},
					rules: {
						required: true,
						message: "名称不能为空"
					}
				},
				{
					label: "模板类型",
					prop: "type",
					span: 12,
					component: {
						// 任意组件名，el-button, el-input, cl-upload ...
						name: "el-select",
						// 只有 name 为：el-select, el-radio-group, el-checkbox-group 可用，作为选项值
						options: [
							{
								label: "移动端",
								value: "mobile"
							},
							{
								label: "客户端",
								value: "client"
							},
							{
								label: "网页端",
								value: "web"
							},
							{
								label: "服务端",
								value: "server"
							}
						],
						// 带入参数
						props: {
							// clearable: true
						},
						// 监听事件
						on: {
							change: (val: any) => {
								// 注意使用箭头函数
								console.log(112)
								console.log(val)
							}
						}
					},
					rules: {
						required: true,
						message: "模板类型不能为空"
					}
				},
				{
					label: "仓库地址",
					prop: "url",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写仓库地址"
						},
						onchange: () => {
							let form = refs.value.upsert.form
							let url = form.url
							try {
								let tmp = url.split("/")
								refs.value.upsert.form.userName = tmp[3]
								refs.value.upsert.form.host = tmp[2]
								refs.value.upsert.form.repo = tmp[4]
							} catch (error) {
								ElMessage.error("请检查是否是不支持的代码托管平台")
							}
						}
					},
					rules: {
						required: true,
						message: "仓库地址不能为空"
					}
				},
				{
					label: "克隆地址",
					prop: "git",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写克隆地址"
						}
					}
				},
				{
					label: "仓库作者",
					prop: "userName",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写仓库作者"
						}
					},
					rules: {
						required: true,
						message: "仓库作者不能为空"
					}
				},
				{
					label: "托管平台",
					prop: "host",
					span: 12,
					component: {
						name: "el-select",
						// 只有 name 为：el-select, el-radio-group, el-checkbox-group 可用，作为选项值
						options: [
							{
								label: "GitHub",
								value: "github.com"
							},
							{
								label: "码云",
								value: "gitee.com"
							}
						]
					},
					rules: {
						required: true,
						message: "托管平台不能为空"
					}
				},

				{
					label: "仓库名称",
					prop: "repo",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写仓库名称"
						}
					},
					rules: {
						required: true,
						message: "仓库名称不能为空"
					}
				},
				{
					label: "分支名称",
					prop: "branch",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写分支名称"
						}
					},
					rules: {
						required: true,
						message: "分支名称不能为空"
					}
				},
				{
					label: "相关描述",
					prop: "desc",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写相关描述",
							type: "textarea",
							rows: 4
						}
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
					label: "模板名称",
					prop: "name",
					minWidth: 150
				},
				{
					prop: "type",
					label: "模板类型",
					minWidth: 120,
					dict: [
						{
							label: "移动",
							value: 1,
							type: "success"
						},
						{
							label: "PC",
							value: 0,
							type: "danger"
						}
					]
				},
				{
					label: "仓库地址",
					prop: "url",
					minWidth: 180
				},
				{
					label: "克隆地址",
					prop: "git"
				},
				{
					label: "相关描述",
					prop: "desc",
					minWidth: 180
				},
				{
					label: "host",
					prop: "host"
				},
				{
					label: "仓库作者",
					prop: "userName"
				},

				{
					label: "仓库名称",
					prop: "repo"
				},
				{
					label: "分支名称",
					prop: "branch"
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
			ctx.service(service.client.cli).done()
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
			onUpsertSubmit
		}
	}
})
</script>
