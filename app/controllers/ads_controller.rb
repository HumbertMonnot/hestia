class AdsController < ApplicationController
  def index
    def index
      @ads = Ad.all
      @ad = Ad.new
      @user = current_user # User.find(params[:user_id])
  end

  def create
    @ad = Ad.new(ad_params)
		@ad.user = current_user
		@ad.state = "pending"
		if @ad.save
			redirect_to user_ads_path(current_user)
		else
			render "ads/index"
		end
  end

  def update
  end

  def destroy
  end

  private

	def ad_params
		params.require(:ad).permit(:title, :url, :size, :address, :price, :comment, :state)
	end
end
