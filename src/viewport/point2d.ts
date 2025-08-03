export class Point2d{
    
	
	constructor(public x: number = 0.0,
        public y: number = 0.0)
	{
		
	}

    add(point : Point2d)
	{
		this.x += point.x;
		this.y += point.y;
		return this;
	}
	add1(px : number)
	{
		this.x += px;
		this.y += px;
		return this;
	}
	add2(px : number,py : number)
	{
		this.x += px;
		this.y += py;
		return this;
	}
	set(px : number,py : number)
	{
		this.x = px;
		this.y = py;
		return this;
	}
	set1(point2d : Point2d)
	{
		this.x = point2d.x;
		this.y = point2d.y;
		return this;
	}
	set2(px : number,py : number)
	{
		this.x = px;
		this.y = py;
		return this;
	}
	subtract(point : Point2d)
	{
		this.x -= point.x;
		this.y -= point.y;
		return this;
	}
	equals(point : Point2d)
	{
		if(this.x == point.x && this.y == point.y)
		{
			return true;
		}
		return false;
		
	}
	equalsNear(point : Point2d,near  : number)
	{
		if(Math.abs(this.x - point.x) < near && Math.abs(this.y - point.y) < near)
		{
			return true;
		}
		return false;
		
	}
	scale(scale  : number)
	{
		this.x *= scale;
		this.y *= scale;
		 return this;
	}
	scale2(scaleX : number,scaleY : number)
	{
		this.x *= scaleX;
		this.y *= scaleY;
		 return this;
	}
	dot(p : Point2d)
	{
		 return (this.x * p.x) + (this.y * p.y);
	}
	cross(vector : Point2d)
	{
		return (this.x*vector.y) - (this.y*vector.x);
	}
	log(){
		return "" + this.x + "," + this.y;
	}
    normalize(){
    	var x = this.x;
    	var y = this.y;
        var len=Math.sqrt((x*x)+(y*y));
        if(len==0){x=0;y=0;}else{
        	this.x=x/len;this.y=y/len;}
        return this;
    }
    advancePoint(p1 : Point2d,scale : number,pTo : Point2d)
	{
		pTo.set1(p1);
		pTo.subtract(this);
		pTo.scale(scale);
		pTo.add(this);
	}
    dist2()
	{
		return (this.x * this.x) + (this.y * this.y);
	}
	magnitude()
	{
		return Math.sqrt(this.dist2());
	}
}