//品类选择器

import React           from 'react';
import Product         from 'service/product-service.jsx';
import MUtil           from 'util/mm.jsx';

const _mm         = new MUtil();
const _product    = new Product();

import './category-selector.scss';

class CategorySelector extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			firstCategoryList  : [],
			firstCategoryId    : 0,
			secondCategoryList : [],
			secondCategoryId   : 0
		}
	}

	componentDidMount(){
		this.loadFirstCategory();
	}

    //加载一级分类
    loadFirstCategory(){
		_product.getCategoryList().then(res => {
			this.setState({
				firstCategoryList : res
			});
		}, errMsg => {
			_mm.errTips(errMsg);
		});
    }
    
    //加载二级分类 
    loadSecondCategory(){
		_product.getCategoryList(this.state.firstCategoryList).then(res => {
			this.setState({
				secondCategoryList : res
			});
		}, errMsg => {
			_mm.errTips(errMsg);
		});
    }

    //选择一级品类
    onFirstCategoryChange(e){
		let newValue = e.target.value || 0;
        this.setState({
        	firstCategoryId    : newValue,
        	secondCategoryId   : 0,
        	secondCategoryList : []
        }, () => {
        	//更新二级品类
        	this.loadSecondCategory();
        	this.onPropsCategoryChange();
        });
    }
    
    onSecondCategoryChange(e){
		let newValue = e.target.value || 0;
        this.setState({
        	secondCategoryId    : newValue
        }, () => {
        	//更新二级品类
        	this.onPropsCategoryChange();
        });
    }

    //传给父组件选中的结果
    onPropsCategoryChange(){
    	//判断props里的回调函数存在 
    	let temp = typeof this.props.onCategoryChange === 'function';
		let categorychangable =temp;
		//如果是有二级品类
		if(this.state.secondCategoryId){
			categorychangable && this.props.onCategoryChange(this.state.secondCategoryId, this.state.firstCategoryId);
		}
        //如果只有一级品类
		else{
			categorychangable && this.props.onCategoryChange(this.state.firstCategoryId, 0);
		}
    }

	render(){
		return (
    		<div className="col-md-10">
				<select className="form-control cate-select"
				    onChange={(e) => this.onFirstCategoryChange(e)}>
					<option value="">请选择一级分类</option>
					{
						this.state.firstCategoryList.map(
							(category, index) =><option value={category.id} key={index}>{category.name}</option>
						)
					}
				</select>
				{
					this.state.secondCategoryList.length ?
					(<select className="form-control cate-select"
						onChange={(e) => this.onSecondCategoryChange(e)}>
						<option value="">请选择二级分类</option>
						{
							this.state.secondCategoryList.map(
								(category, index) =><option value={category.id} key={index}>{category.name}</option>
							)
						}
					</select>) : null
				}
	        </div>
		);
	}
}
 
export default CategorySelector;