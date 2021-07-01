<template>
	<div class="card-list">
		<div class="card-list__header">
			<span>门店销售额排名</span>
		</div>
			<ul class="card-list__list card-list__container">
				<li>
					<span>1</span>
					<span>北京市朝阳区三里屯路</span>
					<span>323201</span>
				</li>
				<li>
					<span>2</span>
					<span>北京市朝阳区建国路-华贸购物中心</span>
					<span>278442</span>
				</li>
				<li>
					<span>3</span>
					<span>北京市朝阳区朝阳北路</span>
					<span>202368</span>
				</li>
				<li>
					<span>4</span>
					<span>北京市东城区王府井大街</span>
					<span>156320</span>
				</li>
				<li>
					<span>5</span>
					<span>北京市西城区西单北大街-大悦城</span>
					<span>98852</span>
				</li>
			</ul>
	</div>
</template>

<script>
export default {
	data() {
		return {

		};
	},

	methods: {

	}
};
</script>

<style lang="scss" scoped>

.card-list {
	height: 560px;
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		color: #333333;
		padding: 0 20px;
	}

	&__container {
		padding: 0 20px;
	}

	&__filter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;

		ul {
			display: flex;
			flex: 1;
			margin-right: 10px;

			li {
				list-style: none;
				font-size: 14px;
				flex: 1;
				cursor: pointer;
				color: #d8d8d8;

				&.active {
					color: #333333;
				}

				&:not(.active):hover {
					color: #999;
				}
			}
		}
	}

	&__list {
		height: 260px;

		li {
			display: flex;
			align-items: center;
			height: 52px;
			list-style: none;
			font-size: 13px;
			cursor: pointer;

			span {
				&:first-child {
					display: inline-block;
					height: 14px;
					width: 14px;
					border-radius: 14px;
					text-align: center;
					line-height: 14px;
					font-size: 12px;
				}

				&:nth-child(2) {
					flex: 1;
					margin: 0 10px;
					letter-spacing: 0.5px;
					color: #222;
				}
			}

			&:nth-last-child(n + 3) {
				span {
					&:first-child {
						background-color: #333333;
						color: #fff;
					}
				}
			}

			&:hover {
				span:nth-child(2) {
					text-decoration: underline;
				}
			}
		}
	}
}
</style>
